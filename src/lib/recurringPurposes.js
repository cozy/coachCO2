import log from 'cozy-logger'

import { getManualPurpose, getAutomaticPurpose } from 'src/lib/trips'
import { setAutomaticPurpose } from 'src/lib/timeseries'
import {
  builTimeserieQueryByAccountIdAndStartPlaceAndEndPlace,
  queryTimeserieByDocId
} from 'src/queries/queries'

// Similar trips = same start/end dipslay name
const findSimilarTimeseries = async (client, timeserie) => {
  const accountId = timeserie.cozyMetadata.sourceAccount
  const startPlaceDisplayName = timeserie.aggregation.startPlaceDisplayName
  const endPlaceDisplayName = timeserie.aggregation.endPlaceDisplayName
  const queryDef = builTimeserieQueryByAccountIdAndStartPlaceAndEndPlace({
    accountId,
    startPlaceDisplayName,
    endPlaceDisplayName
  }).definition
  const timeseries = await client.queryAll(queryDef)
  return timeseries.filter(ts => ts._id !== timeserie._id)
}

export const findClosestWaybackTrips = async (client, timeserie) => {
  const waybackTrips = []
  const accountId = timeserie.cozyMetadata.sourceAccount
  const startPlaceDisplayName = timeserie.aggregation.endPlaceDisplayName
  const endPlaceDisplayName = timeserie.aggregation.startPlaceDisplayName
  // Find closest wayback in the future
  const queryDefForward = builTimeserieQueryByAccountIdAndStartPlaceAndEndPlace(
    {
      accountId,
      startPlaceDisplayName,
      endPlaceDisplayName,
      startDate: timeserie.endDate,
      searchForward: true,
      limit: 1
    }
  ).definition
  const resforward = await client.query(queryDefForward)
  if (resforward?.data?.length > 0) {
    waybackTrips.push(resforward.data[0])
  }
  // Find closest wayback in the past
  const queryDefBackward =
    builTimeserieQueryByAccountIdAndStartPlaceAndEndPlace({
      accountId,
      startPlaceDisplayName,
      endPlaceDisplayName,
      startDate: timeserie.endDate,
      searchForward: false,
      limit: 1
    }).definition
  const resBackward = await client.query(queryDefBackward)
  if (resBackward?.data?.length > 0) {
    waybackTrips.push(resBackward.data[0])
  }
  return waybackTrips
}

export const findAndSetWaybackTimeserie = async (client, initialTimeserie) => {
  const waybackTrips = []
  const closestInitialWaybackTrips = await findClosestWaybackTrips(
    client,
    initialTimeserie
  )
  if (closestInitialWaybackTrips.length > 0) {
    const isRecurringTrip = initialTimeserie.aggregation.recurring
    const purpose = initialTimeserie.aggregation.purpose
    for (const waybackTrip of closestInitialWaybackTrips) {
      waybackTrips.push(
        setAutomaticPurpose(waybackTrip, purpose, {
          isRecurringTrip
        })
      )
    }
  }
  return waybackTrips
}

export const findAndSetWaybackRecurringTimeseries = async (
  client,
  initialTimeserie,
  recurringTimeseries
) => {
  const waybacks = {}

  for (const trip of recurringTimeseries) {
    // Find way-back trips
    const closestWaybackTrips = await findClosestWaybackTrips(client, trip)
    for (const waybackTrip of closestWaybackTrips) {
      if (!waybacks[waybackTrip._id])
        // Avoid duplicates
        waybacks[waybackTrip._id] = waybackTrip
    }
  }
  return setRecurringPurposes(initialTimeserie, Object.values(waybacks))
}

const setManuallyUpdatedTrip = (timeserie, recurringTrips, waybackTrips) => {
  const purpose = getManualPurpose(timeserie.series[0])
  const isRecurringTrip = recurringTrips.length > 0 || waybackTrips.length > 1
  return setAutomaticPurpose(timeserie, purpose, { isRecurringTrip })
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
    const newTS = setAutomaticPurpose(ts, purpose, { isRecurringTrip: true })
    timeseriesToUpdate.push(newTS)
  }

  return timeseriesToUpdate
}

export const runReccuringPurposes = async (client, docId) => {
  const timeserie = await queryTimeserieByDocId(client, docId)
  if (!timeserie) {
    log('error', 'No timeserie found')
    return []
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
  const similarTimeseries = await findSimilarTimeseries(client, timeserie)
  const similarTimeseriesToUpdate = setRecurringPurposes(
    timeserie,
    similarTimeseries
  )
  // Find wayback trips (with reverse start/end place) and set their purpose
  const waybackTimeseries = await findAndSetWaybackTimeserie(client, timeserie)
  const updatedTS = setManuallyUpdatedTrip(
    timeserie,
    similarTimeseries,
    waybackTimeseries
  )
  const recurringWaybackTimeseries = await findAndSetWaybackRecurringTimeseries(
    client,
    updatedTS,
    similarTimeseries
  )

  // Save trips with new purpose
  const timeseriesToUpdate = [
    updatedTS,
    ...similarTimeseriesToUpdate,
    ...waybackTimeseries,
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
