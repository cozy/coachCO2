import log from 'cozy-logger'

import { getManualPurpose, getAutomaticPurpose } from 'src/lib/trips'
import { setAutomaticPurpose } from 'src/lib/timeseries'
import {
  builTimeserieQueryByAccountIdAndStartPlaceAndEndPlaceAndStartDate,
  queryTimeserieByDocId
} from 'src/queries/queries'
import { OTHER_PURPOSE } from 'src/constants'

export const filterByPurposeAndRecurrence = (timeseries, purpose) => {
  return timeseries
    ? timeseries.filter(ts => {
        if (purpose === OTHER_PURPOSE) {
          return (
            !ts?.aggregation?.purpose || ts?.aggregation?.purpose === purpose
          )
        }
        return (
          ts?.aggregation?.purpose === purpose &&
          ts.aggregation?.recurring !== false
        )
      })
    : []
}

// Similar trips = same start/end dipslay name
const findSimilarTimeseries = async (client, timeserie, { oldPurpose }) => {
  const accountId = timeserie?.cozyMetadata?.sourceAccount
  const startPlaceDisplayName = timeserie?.aggregation?.startPlaceDisplayName
  const endPlaceDisplayName = timeserie?.aggregation?.endPlaceDisplayName
  if (
    !accountId ||
    !startPlaceDisplayName ||
    !endPlaceDisplayName ||
    !oldPurpose
  ) {
    throw new Error('Missing attributes to run query')
  }
  const queryDef =
    builTimeserieQueryByAccountIdAndStartPlaceAndEndPlaceAndStartDate({
      accountId,
      startPlaceDisplayName,
      endPlaceDisplayName,
      purpose: oldPurpose
    }).definition
  const timeseries = await client.queryAll(queryDef)
  return filterByPurposeAndRecurrence(
    timeseries.filter(ts => ts._id !== timeserie._id),
    oldPurpose
  )
}

export const findClosestWaybackTrips = async (
  client,
  timeserie,
  { oldPurpose }
) => {
  const waybackTrips = []
  const accountId = timeserie.cozyMetadata.sourceAccount
  const startPlaceDisplayName = timeserie.aggregation.endPlaceDisplayName
  const endPlaceDisplayName = timeserie.aggregation.startPlaceDisplayName
  if (
    !accountId ||
    !startPlaceDisplayName ||
    !endPlaceDisplayName ||
    !oldPurpose
  ) {
    throw new Error('Missing attributes to run query')
  }
  // Find closest wayback in the future
  const queryDefForward =
    builTimeserieQueryByAccountIdAndStartPlaceAndEndPlaceAndStartDate({
      accountId,
      startPlaceDisplayName,
      endPlaceDisplayName,
      purpose: oldPurpose,
      startDate: { $gt: timeserie.endDate },
      limit: 1
    }).definition
  const resForward = await client.query(queryDefForward)
  const nextWayback = filterByPurposeAndRecurrence(resForward?.data, oldPurpose)
  if (nextWayback.length > 0) {
    waybackTrips.push(nextWayback[0])
  }
  // Find closest wayback in the past
  const queryDefBackward =
    builTimeserieQueryByAccountIdAndStartPlaceAndEndPlaceAndStartDate({
      accountId,
      startPlaceDisplayName,
      endPlaceDisplayName,
      purpose: oldPurpose,
      startDate: { $lt: timeserie.startDate },
      limit: 1
    }).definition
  const resBackward = await client.query(queryDefBackward)
  const previousWayback = filterByPurposeAndRecurrence(
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
    log.warn('No manual purpose set for the trip')
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

export const runRecurringPurposes = async (client, { docId, oldPurpose }) => {
  const timeserie = await queryTimeserieByDocId(client, docId)
  if (!timeserie) {
    log('error', 'No timeserie found')
    return []
  }
  if (timeserie?.series.length != 1) {
    throw new Error('error', 'The timeserie is malformed')
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

  // Find wayback trips (with reverse start/end place) and set their purpose
  const waybackInitialTimeseries = await findAndSetWaybackTimeserie(
    client,
    timeserie,
    { oldPurpose, similarTimeseries }
  )

  const updatedTS = setManuallyUpdatedTrip(timeserie)
  const recurringWaybackTimeseries = await findAndSetWaybackRecurringTimeseries(
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

  // Save trips with new purpose
  const timeseriesToUpdate = [
    updatedTS,
    ...similarTimeseriesToUpdate,
    ...waybackInitialTimeseries,
    ...recurringWaybackTimeseries
  ]
  if (timeseriesToUpdate.length > 0) {
    log('info', `${timeseriesToUpdate.length} trips to update`)
    await client.saveAll(timeseriesToUpdate)
  } else {
    log('info', `No trip to update`)
  }
  return timeseriesToUpdate
}
