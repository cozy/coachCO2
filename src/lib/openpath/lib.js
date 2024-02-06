import { TRIP_COLLECTION } from 'src/constants'
import { normalizeTrips } from 'src/lib/openpath/normalizeData'
import { saveTrips } from 'src/lib/openpath/save.js'
import {
  getServerCollectionFromDate,
  getTripsForDay
} from 'src/lib/openpath/traceRequests'

import minilog from 'cozy-minilog'

const log = minilog('openpath')

/**
 * @typedef {import("src/lib/types").OpenPathTrip} OpenPathTrip
 */

/**
 * Filter trip by date
 * @param {Array<OpenPathTrip>} trips - The trips to filter
 * @param {Array<string>} tripStartDates - The start date to keep
 * @returns {Array<OpenPathTrip>} The filtered trips
 */
const filterTripsByDate = (trips, tripStartDates) => {
  return trips.filter(trip => {
    return tripStartDates.includes(trip.properties.start_fmt_time)
  })
}

/**
 * Fetch trips metadata from the given data
 *
 * @param {string} token - The user token
 * @param {Date} startDate - The starting date
 * @param {Object} [options={}] - Optional parameters.
 * @param {boolean} [options.excludeFirst=true] - Flag to exclude the first result.
 * @returns {Promise<object>} The trips metadata
 */
export const fetchTripsMetadata = async (
  token,
  startDate,
  { excludeFirst = true } = {}
) => {
  /* Get all the trips metadata from the given date */
  log.info(`Fetch trips metadata from ${startDate.toISOString()}`)
  return getServerCollectionFromDate(token, {
    startDate,
    collection: TRIP_COLLECTION,
    excludeFirst
  })
}

/**
 * Fetch and save trips from a trace server
 *
 * @param {string} token - The user token
 * @param {Array<OpenPathTrip>} tripsMetadata - The trips metadata to fetch
 * @param {object} option - The options

 * @returns {Promise<string| null>} The date of the last saved trip
 */
export const fetchAndSaveTrips = async (
  client,
  token,
  tripsMetadata,
  { accountId, device }
) => {
  /* Extract the days having saved trips */
  log.info(`${tripsMetadata.length} new trips to retrieve`)
  let tripDays = {}
  const tripStartDates = []

  for (const trip of tripsMetadata) {
    const startTripDate = new Date(trip.data.start_fmt_time).toISOString()
    const day = startTripDate.split('T')[0]
    tripDays[day] = true
    tripStartDates.push(trip.data.start_fmt_time)
  }

  /* Fetch and save the actual trips for the relevant days */
  let fetchedTrips = []
  for (const day of Object.keys(tripDays)) {
    log.info(`Fetch trips on ${day}`)
    try {
      const fullTripsForDay = await getTripsForDay(token, day)
      // The trips need to be filtered, as the day is not precise enough
      const filteredTrips = filterTripsByDate(fullTripsForDay, tripStartDates)
      fetchedTrips = fetchedTrips.concat(filteredTrips)
    } catch (err) {
      if (err.status === 500) {
        log.warn('Failing day: skip it')
        // This day is failing: skip it
        continue
      } else {
        throw new Error(err)
      }
    }
  }
  if (fetchedTrips.length < 1) {
    return null
  }

  log.info(`${fetchedTrips.length} trips fetched`)

  const tripsToSave = await normalizeTrips(client, fetchedTrips, {
    device
  })
  await saveTrips(client, tripsToSave, { accountId })
  return tripsMetadata[tripsMetadata.length - 1].metadata.write_fmt_time
}
