// @ts-check
import log from 'cozy-logger'

import { getManualPurpose, getAutomaticPurpose } from 'src/lib/trips'
import { setAutomaticPurpose } from 'src/lib/timeseries'
import {
  buildNewestRecurringTimeseriesQuery,
  buildSettingsQuery,
  buildTimeseriesQueryByAccountIdAndDate,
  builTimeserieQueryByAccountIdAndStartPlaceAndEndPlaceAndStartDateAndDistance,
  queryTimeserieByDocId
} from 'src/queries/queries'
import { OTHER_PURPOSE } from 'src/constants'
import { set } from 'lodash'

/**
 * Filter timeseries to keep those with recurring purposes
 *
 * @param {Array<object>} timeseries - The timeseries to filter
 * @returns {Array<object>} The filtered timeseries
 */
export const keepTripsWithRecurringPurposes = timeseries => {
  return timeseries.filter(ts => {
    if (ts?.aggregation?.recurring === false) {
      return false
    }
    return (
      ts?.aggregation?.purpose && ts?.aggregation?.purpose !== OTHER_PURPOSE
    )
  })
}

/**
 * Filter timeseries to keep those with the same given purpose,
 * with those additional rules:
 *
 * - Trips with explicit 'recurring: false' should be excluded
 * - When the purpose is OTHER_PURPOSE, we include trips with missing purpose
 *
 * @param {Array<object>} timeseries - The timeseries to filter
 * @param {string} purpose - The searched purpose
 * @returns {Array<object>} The filtered timeseries
 */
export const keepTripsWithSameRecurringPurpose = (timeseries, purpose) => {
  return timeseries
    ? timeseries.filter(ts => {
        if (ts?.aggregation?.recurring === false) {
          return false
        }
        if (purpose === OTHER_PURPOSE) {
          return (
            !ts?.aggregation?.purpose || ts?.aggregation?.purpose === purpose
          )
        }
        return ts?.aggregation?.purpose === purpose
      })
    : []
}

const queryTimeseriesByPlaceAndDate = async (
  client,
  {
    accountId,
    startPlaceDisplayName,
    endPlaceDisplayName,
    distance,
    _id,
    oldPurpose = null
  }
) => {
  const queryDef =
    builTimeserieQueryByAccountIdAndStartPlaceAndEndPlaceAndStartDateAndDistance(
      {
        accountId,
        startPlaceDisplayName,
        endPlaceDisplayName,
        distance
      }
    ).definition
  const results = await client.queryAll(queryDef)
  const timeseries = results.filter(ts => ts._id !== _id)
  return !oldPurpose
    ? keepTripsWithRecurringPurposes(timeseries)
    : keepTripsWithSameRecurringPurpose(timeseries, oldPurpose)
}

// Similar trips = same start/end dipslay name
export const findSimilarTimeseries = async (
  client,
  timeserie,
  { oldPurpose = null } = {}
) => {
  const accountId = timeserie?.cozyMetadata?.sourceAccount
  const startPlaceDisplayName = timeserie?.aggregation?.startPlaceDisplayName
  const endPlaceDisplayName = timeserie?.aggregation?.endPlaceDisplayName
  const distance = timeserie?.aggregation?.totalDistance
  if (
    !accountId ||
    !startPlaceDisplayName ||
    !endPlaceDisplayName ||
    !distance
  ) {
    log(
      'error',
      `Missing attributes to run similar trip query for trip ${timeserie._id}`
    )
    return []
  }
  return queryTimeseriesByPlaceAndDate(client, {
    accountId,
    startPlaceDisplayName,
    endPlaceDisplayName,
    oldPurpose,
    distance,
    _id: timeserie._id
  })
}

const findWaybackTimeseries = async (client, timeserie) => {
  const accountId = timeserie?.cozyMetadata?.sourceAccount
  const startPlaceDisplayName = timeserie.aggregation.endPlaceDisplayName
  const endPlaceDisplayName = timeserie.aggregation.startPlaceDisplayName
  const distance = timeserie?.aggregation?.totalDistance
  return queryTimeseriesByPlaceAndDate(client, {
    accountId,
    startPlaceDisplayName,
    endPlaceDisplayName,
    distance,
    _id: timeserie._id
  })
}

export const findClosestWaybackTrips = async (
  client,
  timeserie,
  { oldPurpose = null }
) => {
  const waybackTrips = []
  const accountId = timeserie?.cozyMetadata?.sourceAccount
  const startPlaceDisplayName = timeserie?.aggregation?.endPlaceDisplayName
  const endPlaceDisplayName = timeserie?.aggregation?.startPlaceDisplayName
  const distance = timeserie?.aggregation?.totalDistance
  if (
    !accountId ||
    !startPlaceDisplayName ||
    !endPlaceDisplayName ||
    !distance
  ) {
    log(
      'error',
      `Missing attributes to run wayback query for trip ${timeserie._id}`
    )
    return []
  }
  // Find closest wayback in the future
  const queryDefForward =
    builTimeserieQueryByAccountIdAndStartPlaceAndEndPlaceAndStartDateAndDistance(
      {
        accountId,
        startPlaceDisplayName,
        endPlaceDisplayName,
        distance,
        startDate: { $gt: timeserie.endDate },
        limit: 1
      }
    ).definition
  const resForward = await client.query(queryDefForward)
  const nextWayback = keepTripsWithSameRecurringPurpose(
    resForward?.data,
    oldPurpose
  )
  if (nextWayback.length > 0) {
    waybackTrips.push(nextWayback[0])
  }
  // Find closest wayback in the past
  const queryDefBackward =
    builTimeserieQueryByAccountIdAndStartPlaceAndEndPlaceAndStartDateAndDistance(
      {
        accountId,
        startPlaceDisplayName,
        endPlaceDisplayName,
        distance,
        // @ts-ignore
        startDate: { $lt: timeserie.startDate },
        limit: 1
      }
    ).definition
  const resBackward = await client.query(queryDefBackward)
  const previousWayback = keepTripsWithSameRecurringPurpose(
    resBackward?.data,
    oldPurpose
  )
  if (previousWayback.length > 0) {
    waybackTrips.push(previousWayback[0])
  }
  return waybackTrips
}

export const findAndSetWaybackTimeserie = async (
  client,
  initialTimeserie,
  { oldPurpose }
) => {
  const waybackTrips = []
  const closestInitialWaybackTrips = await findClosestWaybackTrips(
    client,
    initialTimeserie,
    { oldPurpose }
  )
  if (closestInitialWaybackTrips.length > 0) {
    const purpose = initialTimeserie?.aggregation?.purpose
    for (const waybackTrip of closestInitialWaybackTrips) {
      waybackTrips.push(setAutomaticPurpose(waybackTrip, purpose))
    }
  }
  return waybackTrips
}

export const findAndSetWaybackRecurringTimeseries = async (
  client,
  initialTimeserie,
  recurringTimeseries,
  { oldPurpose, waybackInitialTimeseries }
) => {
  const waybacks = {}
  const waybackInitialIds = waybackInitialTimeseries.map(ts => ts._id)
  for (const trip of recurringTimeseries) {
    // Find way-back trips
    const closestWaybackTrips = await findClosestWaybackTrips(client, trip, {
      oldPurpose
    })
    for (const waybackTrip of closestWaybackTrips) {
      if (
        !waybacks[waybackTrip._id] &&
        !waybackInitialIds.includes(waybackTrip._id)
      ) {
        // Avoid duplicates
        waybacks[waybackTrip._id] = waybackTrip
      }
    }
  }
  return setRecurringPurposes(initialTimeserie, Object.values(waybacks))
}

export const setManuallyUpdatedTrip = timeserie => {
  const purpose = getManualPurpose(timeserie.series[0])
  return setAutomaticPurpose(timeserie, purpose)
}

export const setRecurringPurposes = (timeserie, similarTimeseries) => {
  const purpose = getManualPurpose(timeserie.series[0])
  if (!purpose) {
    log('warn', 'No manual purpose set for the trip')
    return []
  }

  const timeseriesToUpdate = []
  for (const ts of similarTimeseries) {
    const trip = ts.series[0]
    if (getAutomaticPurpose(trip) === purpose) {
      // No need to update trips with the same automatic purpose
      continue
    }
    const newTS = setAutomaticPurpose(ts, purpose)
    timeseriesToUpdate.push(newTS)
  }

  return timeseriesToUpdate
}

const getTimeserieWithPurpose = timeseries => {
  return timeseries.find(ts => {
    const purpose = ts?.aggregation?.purpose
    return purpose && purpose !== OTHER_PURPOSE
  })
}

const isLoopTrip = timeserie => {
  return (
    timeserie?.aggregation?.startPlaceDisplayName ===
    timeserie?.aggregation?.endPlaceDisplayName
  )
}

export const findPurposeFromSimilarTimeserieAndWaybacks = async (
  client,
  timeserie
) => {
  const similarTimeseries = await findSimilarTimeseries(client, timeserie)
  let tsWithPurpose = getTimeserieWithPurpose(similarTimeseries)
  if (!tsWithPurpose) {
    // if no similar trips with purpose found, try with waybacks trips
    const waybackTimeseries = await findWaybackTimeseries(client, timeserie)
    tsWithPurpose = getTimeserieWithPurpose(waybackTimeseries)
  }
  return tsWithPurpose?.aggregation?.purpose || null
}

const findRecurringTripsFromTimeserie = async (
  client,
  timeserie,
  { oldPurpose }
) => {
  if (!timeserie) {
    log('error', 'No timeserie found')
    return []
  }
  if (timeserie?.series.length != 1) {
    throw new Error('The timeserie is malformed')
  }
  if (!getManualPurpose(timeserie.series[0])) {
    log('error', 'No manual purpose found')
    return []
  }
  if (!timeserie.aggregation) {
    log('warn', 'Timeserie without aggregation')
    return []
  }
  // Find similar trips and set their purpose
  const similarTimeseries = await findSimilarTimeseries(client, timeserie, {
    oldPurpose
  })
  const similarTimeseriesToUpdate = setRecurringPurposes(
    timeserie,
    similarTimeseries
  )
  log('info', `Found ${similarTimeseries.length} similar timeseries`)
  const updatedTS = setManuallyUpdatedTrip(timeserie)

  let timeseriesToUpdate = []
  if (!isLoopTrip(timeserie)) {
    // Find wayback trips (with reverse start/end place) and set their purpose
    const waybackInitialTimeseries = await findAndSetWaybackTimeserie(
      client,
      timeserie,
      { oldPurpose }
    )

    const recurringWaybackTimeseries =
      await findAndSetWaybackRecurringTimeseries(
        client,
        updatedTS,
        similarTimeseries,
        { oldPurpose, waybackInitialTimeseries }
      )
    log(
      'info',
      `Found ${
        waybackInitialTimeseries.length + recurringWaybackTimeseries.length
      } wayback timeseries`
    )
    timeseriesToUpdate = [
      updatedTS,
      ...similarTimeseriesToUpdate,
      ...waybackInitialTimeseries,
      ...recurringWaybackTimeseries
    ]
  } else {
    // Do not search for wayback for loop trips
    timeseriesToUpdate = [updatedTS, ...similarTimeseriesToUpdate]
  }

  return timeseriesToUpdate
}

const saveTrips = async (client, timeseriesToUpdate) => {
  if (timeseriesToUpdate.length > 0) {
    log('info', `${timeseriesToUpdate.length} trips to update`)
    return client.saveAll(timeseriesToUpdate)
  }
  log('info', `No trip to update`)
  return []
}

/**
 * Look for existing recurring purpose on similar trips for newly
 * created trips.
 *
 * @param {object} client - The cozy-client instance
 * @returns {Promise<Array>} The updated trips
 */
export const runRecurringPurposesForNewTrips = async client => {
  const settings = await client.query(buildSettingsQuery().definition)
  const accountId = settings.data?.[0]?.account?._id
  if (!accountId) {
    log('error', 'No account found')
    return []
  }
  const newestRecurringTimeserie = await client.query(
    buildNewestRecurringTimeseriesQuery({ accountId }).definition
  )
  if (!newestRecurringTimeserie.data?.[0]) {
    // No recurring trip: nothing to do
    log('info', 'No recurring trip found.')
    return []
  }
  const oldestDateToQuery = newestRecurringTimeserie.data?.[0].startDate
  log('info', `Looking for trips from ${oldestDateToQuery}`)

  const timeseries = await client.queryAll(
    buildTimeseriesQueryByAccountIdAndDate({
      accountId,
      date: oldestDateToQuery
    }).definition
  )
  let nTripsWithAutoPurpose = 0
  const timeseriesToUpdate = []

  for (const timeserie of timeseries) {
    const newPurpose = await findPurposeFromSimilarTimeserieAndWaybacks(
      client,
      timeserie
    )
    let newTS
    if (newPurpose) {
      // Set automatic purpose if a a purpose is found in older similar timeserie
      newTS = setAutomaticPurpose(timeserie, newPurpose)
      nTripsWithAutoPurpose++
    } else {
      // Set recurring for trips without purpose, as they might be used for future purposes
      newTS = set(timeserie, 'aggregation.recurring', true)
    }
    timeseriesToUpdate.push(newTS)
  }
  log('info', `Set ${nTripsWithAutoPurpose} trips with automatic purpose`)
  return saveTrips(client, timeseriesToUpdate)
}

/**
 * Look for similar trips to set the same purpose than the
 * given trip, after the user set a manual purpose
 *
 * @param {object} client - The cozy-client instance
 * @param {object} params
 * @param {string} params.docId - The trip docId
 * @param {string} params.oldPurpose - The trip purpose before the manual change
 * @returns {Promise<Array>} The updated trips
 */
export const runRecurringPurposesForManualTrip = async (
  client,
  { docId, oldPurpose }
) => {
  // A new purpose has been manually set: look for existing trips to update
  const timeserie = await queryTimeserieByDocId(client, docId)

  const timeseriesToUpdate = await findRecurringTripsFromTimeserie(
    client,
    timeserie,
    { oldPurpose }
  )
  return saveTrips(client, timeseriesToUpdate)
}
