import { set } from 'lodash'
import {
  COMMUTE_PURPOSE,
  COORDINATES_DISTANCE_THRESHOLD_M,
  HOME_ADDRESS_CATEGORY,
  OTHER_PURPOSE,
  TRIPS_DISTANCE_SIMILARITY_RATIO,
  WORK_ADDRESS_CATEGORY
} from 'src/constants'
import { CONTACTS_DOCTYPE, GEOJSON_DOCTYPE } from 'src/doctypes'
import { findMatchingStartAndEnd } from 'src/lib/contacts'
import {
  getEndPlaceCoordinates,
  getStartPlaceCoordinates,
  isLoopTrip,
  setAutomaticPurpose,
  makeAggregationTitle
} from 'src/lib/timeseries'
import { getManualPurpose, getAutomaticPurpose } from 'src/lib/trips'
import {
  buildNewestRecurringTimeseriesQuery,
  buildRecurringTimeseriesByStartAndEndPointRange,
  buildContactsWithGeoCoordinates,
  buildTimeseriesQueryByDate
} from 'src/queries/nodeQueries'
import { queryContactByDocId, queryTimeserieByDocId } from 'src/queries/queries'

import { models } from 'cozy-client'
import logger from 'cozy-logger'

const logService = logger.namespace('services/recurringPurposes')

const { deltaLatitude, deltaLongitude, geodesicDistance } = models.geo

/**
 * @typedef {import('./types').TimeseriesGeoJSON} TimeSerie
 * @typedef {import('./types').Contact} Contact
 */

/**
 * Recurring purposes categorization service.
 *
 * This is used to automatically set purpose for new incoming trips, based on previous
 * similar trips.
 * The reasoning is the following: a user has recurring trips, with same start and end places.
 * Then, it makes sense to set the same purpose for those similar trips.
 * To find similar trips, we rely on the start and end coordinates of the trip. If we find a previous trip
 * with close coordinates (with a spatial threshold to handle small GPS errors) and with a purpose, we use
 * the same purpose for the trip.
 * We also take advantage of saved contact's address with geo information: if we find contacts with such
 * information, and if the address is close enough to the start or end place, we add a relationship on the
 * trip with the address' contact.
 * Then, if both the start and end addresses are found, and if the addresses includes a cozyCategory, we can
 * apply some rules: typically, a HOME start address and a WORK end address will result in a COMMUTE purpose.
 *
 * Note that the contats' addresses are updated with the matching trip coordinates, to incrementally improve
 * the coordinates precision.
 */

const findContactsWithGeo = async client => {
  const queryDef = buildContactsWithGeoCoordinates().definition
  const contacts = await client.queryAll(queryDef)
  return contacts
}

export const setAddressContactRelationShip = ({
  timeserie,
  contact,
  addressId,
  relType
}) => {
  const newRel = {
    [relType]: {
      data: {
        _id: contact._id,
        _type: CONTACTS_DOCTYPE,
        metadata: {
          addressId
        }
      }
    }
  }
  const timeserieWithRel = {
    ...timeserie,
    relationships: { ...(timeserie.relationships || {}), ...newRel }
  }

  return timeserieWithRel
}

const updateAddressCoordinates = async ({
  client,
  newCoordinates,
  contact,
  addressId
}) => {
  let newContact
  try {
    const contactToUpdate = setNewAddressCoordinates({
      newCoordinates,
      contact,
      addressId
    })
    logService('info', `Update contact ${contact._id} on address ${addressId}`)

    newContact = await client.save(contactToUpdate)
  } catch (err) {
    if (err.status === 409) {
      logService('info', 'Got conflict on contact update... Retry...')
      const conflictedContact = await queryContactByDocId(client, contact._id)
      const updatedContact = setNewAddressCoordinates({
        newCoordinates,
        contact: conflictedContact,
        addressId
      })
      newContact = await client.save(updatedContact)
    } else {
      throw new Error('Error while saving contact: ', err)
    }
  }
  return newContact
}

const setNewAddressCoordinates = ({ newCoordinates, contact, addressId }) => {
  const newContact = { ...contact }
  const addressIdx = contact.address.findIndex(addr => addr.id === addressId)
  if (addressIdx < 0) {
    logService(
      'warn',
      `No address ${addressId} found on contact ${contact._id}`
    )
    return null
  }
  const currCoordinates = newContact.address[addressIdx].geo?.geo
  const currCount = newContact.address[addressIdx].geo?.count || 0
  const currSum = newContact.address[addressIdx].geo?.sum || [0, 0]
  const newSumLon = currSum[0] + newCoordinates.lon
  const newSumLat = currSum[1] + newCoordinates.lat

  if (!currCoordinates) {
    newContact.address[addressIdx].geo = {
      geo: [newCoordinates.lon, newCoordinates.lat]
    }
  } else {
    // XXX - This is an incremental average of longitudes and latitudes, that does not
    // take into consideration of curvature of the Earth. Hence, this is an approximation.
    // We consider this is acceptable as the coordinates are supposed to be very close, i.e. few meters.
    // For more precise computations, one should typically use a geodesic center of all the points.

    const count = currCount + 1
    const avgLon = newSumLon / count
    const avgLat = newSumLat / count

    newContact.address[addressIdx].geo.geo = [avgLon, avgLat]
    logService('info', `New address coordinates set : ${[avgLon, avgLat]}`)
    logService(
      'info',
      `Distance from previous coordinates: ${geodesicDistance(
        { lon: currCoordinates[0], lat: currCoordinates[1] },
        { lon: newCoordinates.lon, lat: newCoordinates.lat }
      )}`
    )
  }

  newContact.address[addressIdx].geo.count = currCount + 1
  newContact.address[addressIdx].geo.sum = [newSumLon, newSumLat]
  logService(
    'info',
    `Update contact ${contact.displayName} on address ${contact.address[addressIdx].formattedAddress}`
  )
  return newContact
}

export const shouldSetCommutePurpose = (start, end) => {
  if (!start || !end) {
    return false
  }
  const startCategory = start.address?.geo?.cozyCategory
  const endCategory = end.address?.geo?.cozyCategory
  // Only support for commute for now, but might evolve in the future
  if (
    (startCategory === HOME_ADDRESS_CATEGORY &&
      endCategory === WORK_ADDRESS_CATEGORY) ||
    (startCategory === WORK_ADDRESS_CATEGORY &&
      endCategory === HOME_ADDRESS_CATEGORY)
  ) {
    return true
  }
  return false
}

const isDistanceLessThanThreshold = (point1, point2) => {
  const distance = geodesicDistance(point1, point2)
  return distance < COORDINATES_DISTANCE_THRESHOLD_M
}

export const areSimiliarTimeseriesByCoordinates = (refTs, compareTs) => {
  const startRefCoordinates = getStartPlaceCoordinates(refTs)
  const endRefCoordinates = getEndPlaceCoordinates(refTs)

  const startCompareCoordinates = getStartPlaceCoordinates(compareTs)
  const endCompareCoordinates = getEndPlaceCoordinates(compareTs)

  const closeStart = isDistanceLessThanThreshold(
    startRefCoordinates,
    startCompareCoordinates
  )
  const closeEnd = isDistanceLessThanThreshold(
    endRefCoordinates,
    endCompareCoordinates
  )

  if (closeStart && closeEnd) {
    return true
  }

  const closeWaybackStart = isDistanceLessThanThreshold(
    startRefCoordinates,
    endCompareCoordinates
  )
  const closeWaybackEnd = isDistanceLessThanThreshold(
    endRefCoordinates,
    startCompareCoordinates
  )

  if (closeWaybackStart && closeWaybackEnd) {
    return true
  }

  return false
}

/**
 * Filter timeseries to keep those with recurring purposes
 *
 * @param {Array<TimeSerie>} timeseries - The timeseries to filter
 * @returns {Array<TimeSerie>} The filtered timeseries
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
 * @param {Array<TimeSerie>} timeseries - The timeseries to filter
 * @param {string} purpose - The searched purpose
 * @returns {Array<TimeSerie>} The filtered timeseries
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

const queryRecurringTimeseriesWithCloseStartOrEnd = async (
  client,
  { startCoord, endCoord }
) => {
  const deltaLat = deltaLatitude(COORDINATES_DISTANCE_THRESHOLD_M)
  const deltaLon = deltaLongitude(deltaLat, COORDINATES_DISTANCE_THRESHOLD_M)

  const minLonStart = startCoord.lon - deltaLon
  const maxLonStart = startCoord.lon + deltaLon
  const minLatStart = startCoord.lat - deltaLon
  const maxLatStart = startCoord.lat + deltaLon

  const minLonEnd = endCoord.lon - deltaLon
  const maxLonEnd = endCoord.lon + deltaLon
  const minLatEnd = endCoord.lat - deltaLon
  const maxLatEnd = endCoord.lat + deltaLon

  const queryDef = buildRecurringTimeseriesByStartAndEndPointRange({
    minLatStart,
    maxLatStart,
    minLonStart,
    maxLonStart,
    minLonEnd,
    maxLonEnd,
    minLatEnd,
    maxLatEnd
  }).definition

  const results = await client.queryAll(queryDef)
  return results || []
}

/**
 * Filter out timeseries with a too high distance difference w.r.t.
 * the base distance
 * @param {Array<TimeSerie>} timeseries - The timeseries to filter
 * @param {number} baseDistance - The distance that timeseries must be close
 * @returns {Array<TimeSerie>} The filtered timeseries
 */
export const filterTripsBasedOnDistance = (timeseries, baseDistance) => {
  const maxDistance =
    baseDistance + baseDistance * TRIPS_DISTANCE_SIMILARITY_RATIO
  const minDistance =
    baseDistance - baseDistance * TRIPS_DISTANCE_SIMILARITY_RATIO
  return timeseries.filter(ts => {
    return (
      ts.aggregation?.totalDistance >= minDistance &&
      ts.aggregation?.totalDistance <= maxDistance
    )
  })
}
/**
 * Post filter timeseries results
 *
 * @typedef Options
 * @property {string} oldPurpose - The previous timeserie purpose
 *
 * @param {Array<TimeSerie>} results - The timeseries to filter
 * @param {TimeSerie} timeserie - The reference timeserie
 * @param {Options} options
 * @returns {Array<TimeSerie>} The filtered timeseries
 */
const postFilterResults = (results, timeserie, { oldPurpose }) => {
  let similarTimeseries = results.filter(ts => ts._id !== timeserie._id)

  similarTimeseries = !oldPurpose
    ? keepTripsWithRecurringPurposes(similarTimeseries)
    : keepTripsWithSameRecurringPurpose(similarTimeseries, oldPurpose)

  if (isLoopTrip(timeserie)) {
    logService('info', 'Detected loop trip')
    // Filter out trips with a too high distance difference
    // This is done only for loop trips, that are particular: it makes less sense
    // to only on start and end points, so we add a distance filter to keep
    // similar trips.
    // Note this is far from perfect and should eventually be improved
    similarTimeseries = filterTripsBasedOnDistance(similarTimeseries)
  }
  return similarTimeseries
}

// Group contacts by id and address id
export const groupContactsAddress = matchingContactsInfo => {
  return matchingContactsInfo.reduce((acc, contact) => {
    const contactId = contact.contact._id
    const addressId = contact.address.id
    const key = `${contactId}/${addressId}`
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(contact)
    return acc
  }, {})
}

export const saveContactsWithNewCoordinates = async ({
  client,
  matchingContactsInfo
}) => {
  if (!matchingContactsInfo || matchingContactsInfo.length < 1) {
    logService('info', `No matching address found`)
    return null
  }
  const addressGroups = groupContactsAddress(matchingContactsInfo)
  logService('info', `${Object.keys(addressGroups).length} address to update`)

  for (const id of Object.keys(addressGroups)) {
    const addressId = id.split('/')[1]
    const group = addressGroups[id]

    const sumCoordinates = { lon: 0, lat: 0 }
    for (const contact of group) {
      sumCoordinates.lon += contact.newCoordinates.lon
      sumCoordinates.lat += contact.newCoordinates.lat
    }

    const count = group.length
    const avgCoordinates = {
      lon: sumCoordinates.lon / count,
      lat: sumCoordinates.lat / count
    }
    await updateAddressCoordinates({
      client,
      newCoordinates: avgCoordinates,
      contact: group[0].contact,
      addressId: addressId
    })
  }
}

/**
 * Find similar recurring timeseries, notably based on their coordinates.
 *
 * @typedef Options
 * @property {boolean} isWayBack -Whether or not the start and end should be reversed
 * @property {string} oldPurpose - The previous purpose of the timeserie
 *
 * @param {Object} client - The cozy client instance
 * @param {TimeSerie} timeserie - The timeserie to find similar ones
 * @param {Options} options
 * @returns {Promise<Array<TimeSerie>>}
 */
export const findSimilarRecurringTimeseries = async (
  client,
  timeserie,
  { isWayBack = false, oldPurpose } = {}
) => {
  const startCoord = isWayBack
    ? getEndPlaceCoordinates(timeserie)
    : getStartPlaceCoordinates(timeserie)
  const endCoord = isWayBack
    ? getStartPlaceCoordinates(timeserie)
    : getEndPlaceCoordinates(timeserie)

  if (!startCoord || !endCoord) {
    logService(
      'error',
      'Missing attributes to run similar trip query for trip',
      timeserie._id
    )
    return []
  }

  const results = await queryRecurringTimeseriesWithCloseStartOrEnd(client, {
    startCoord,
    endCoord
  })
  // Post-filter timeseries. Note this is not done through the query as it could complexify it
  // and hurt perfomances.
  return postFilterResults(results, timeserie, {
    oldPurpose
  })
}

export const setManuallyUpdatedTrip = timeserie => {
  const purpose = getManualPurpose(timeserie.series[0])
  return setAutomaticPurpose(timeserie, purpose)
}

export const setRecurringPurposes = (timeserie, similarTimeseries) => {
  const purpose = getManualPurpose(timeserie.series[0])
  if (!purpose) {
    logService('warn', 'No manual purpose set for the trip')
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

export const findPurposeFromSimilarTimeserieAndWaybacks = async (
  client,
  timeserie
) => {
  const similarTimeseries = await findSimilarRecurringTimeseries(
    client,
    timeserie
  )
  logService('info', `Found ${similarTimeseries.length} similar timeseries`)

  let tsWithPurpose = getTimeserieWithPurpose(similarTimeseries)

  if (!tsWithPurpose) {
    // if no similar trips with purpose found, try with waybacks trips
    const waybackTimeseries = await findSimilarRecurringTimeseries(
      client,
      timeserie,
      {
        isWayBack: true
      }
    )
    logService('info', `Found ${waybackTimeseries.length} wayback timeseries`)
    tsWithPurpose = getTimeserieWithPurpose(waybackTimeseries)
  }
  return tsWithPurpose?.aggregation?.purpose || null
}

/**
 * Try to set a purpose to a timeserie, from existing contacts' addresses
 *
 * It is based on the geo coordinates. If a match is found on the start or end
 * address, a relationship is added, and the contact geo information is updated
 * with the trip coordinates, to incrementally improve the geolocation precision.
 *
 * @param {import("cozy-client/dist/index").CozyClient} client - The cozy client instance
 * @param {TimeSerie} timeserie - The timeserie to categorize
 * @param {Array<Contact>} contacts - The contacts with geo information
 * @returns {TimeSerie} The timeserie to update
 */
const findPurposeFromContactAddresses = async (client, timeserie, contacts) => {
  const { matchingStart, matchingEnd } = findMatchingStartAndEnd(
    timeserie,
    contacts
  )
  let newTimeserie = { ...timeserie }
  if (!matchingStart && !matchingEnd) {
    logService('info', 'No matching start and end places for this trip')
    return { newTimeserie }
  }

  if (matchingStart) {
    logService('info', 'Found a matching start place: add relationship')
    newTimeserie = setAddressContactRelationShip({
      timeserie: newTimeserie,
      contact: matchingStart.contact,
      addressId: matchingStart.address.id,
      relType: 'startPlaceContact'
    })
  }
  if (matchingEnd) {
    logService('info', 'Found a matching end place: add relationship')
    newTimeserie = setAddressContactRelationShip({
      timeserie: newTimeserie,
      contact: matchingEnd.contact,
      addressId: matchingEnd.address.id,
      relType: 'endPlaceContact'
    })
  }

  if (shouldSetCommutePurpose(matchingStart, matchingEnd)) {
    logService(
      'info',
      `Set COMMUTE purpose for trip ${timeserie._id} because of similar start and end places`
    )
    newTimeserie = setAutomaticPurpose(newTimeserie, COMMUTE_PURPOSE)
  }
  return {
    newTimeserie,
    matchingStart,
    matchingEnd
  }
}

const findRecurringTripsFromTimeserie = async (
  client,
  timeserie,
  { oldPurpose }
) => {
  if (!timeserie) {
    logService('error', 'No timeserie found')
    return []
  }
  if (timeserie?.series.length != 1) {
    throw new Error('The timeserie is malformed')
  }
  if (!getManualPurpose(timeserie.series[0])) {
    logService('error', 'No manual purpose found')
    return []
  }
  if (!timeserie.aggregation) {
    logService('warn', 'Timeserie without aggregation')
    return []
  }
  // Find similar trips
  const similarTimeseries = await findSimilarRecurringTimeseries(
    client,
    timeserie,
    {
      oldPurpose
    }
  )
  logService('info', `Found ${similarTimeseries.length} similar timeseries`)
  // Find similar wayback trips
  const similarWaybackTimeseries = await findSimilarRecurringTimeseries(
    client,
    timeserie,
    {
      oldPurpose,
      isWayBack: true
    }
  )
  logService(
    'info',
    `Found ${similarWaybackTimeseries.length} similar wayback timeseries`
  )

  // Set recurring purposes for similar trips
  const similarTimeseriesToUpdate = setRecurringPurposes(timeserie, [
    ...similarTimeseries,
    ...similarWaybackTimeseries
  ])
  const updatedTS = setManuallyUpdatedTrip(timeserie)

  const timeseriesToUpdate = [updatedTS, ...similarTimeseriesToUpdate]
  return timeseriesToUpdate
}

const saveTrips = async ({ client, timeseriesToUpdate, t }) => {
  if (timeseriesToUpdate.length < 1) {
    logService('info', 'No trip to update')
    return []
  }
  logService('info', `${timeseriesToUpdate.length} trips to update`)

  // ATM, necessary because of https://github.com/cozy/cozy-client/issues/493
  const timeseries = client.hydrateDocuments(
    GEOJSON_DOCTYPE,
    timeseriesToUpdate
  )

  const savedTimeseries = []
  for (const timeserie of timeseries) {
    set(
      timeserie,
      'aggregation.automaticTitle',
      makeAggregationTitle(timeserie, t)
    )
    const savedTs = await client.save(timeserie)
    savedTimeseries.push(savedTs)
  }
  return savedTimeseries
}

/**
 * Look for existing recurring purpose on similar trips for newly
 * created trips.
 *
 * @param {import("cozy-client/dist/index").CozyClient} client - The cozy-client instance
 * @returns {Promise<Array<TimeSerie>>} The updated trips
 */
export const runRecurringPurposesForNewTrips = async (client, t) => {
  const newestRecurringTimeserie = await client.query(
    buildNewestRecurringTimeseriesQuery().definition
  )
  let oldestDateToQuery
  if (!newestRecurringTimeserie.data?.[0]) {
    // No recurring trip yet: use all trips
    logService('info', 'No recurring trip found.')
    oldestDateToQuery = new Date(0).toISOString()
  } else {
    oldestDateToQuery = newestRecurringTimeserie.data?.[0].startDate
  }
  logService('info', `Looking for trips from ${oldestDateToQuery}`)

  const timeseries = await client.queryAll(
    buildTimeseriesQueryByDate({
      date: oldestDateToQuery
    }).definition
  )
  let nTripsWithAutoPurpose = 0
  const timeseriesToUpdate = []
  const matchingContactsInfo = []

  if (timeseries.length > 0) {
    const contactsWithAtLeastOneGeoAddress = await findContactsWithGeo(client)
    logService(
      'info',
      `Found ${contactsWithAtLeastOneGeoAddress.length} contacts with geo info`
    )
    logService('info', `${timeseries.length} timeseries found`)

    for (const timeserie of timeseries) {
      logService(
        'info',
        `Try to set a recurring purpose to ${timeserie._id}...`
      )
      let newTS
      // First, try to find purpose by contact's addresses
      const { newTimeserie, matchingStart, matchingEnd } =
        await findPurposeFromContactAddresses(
          client,
          timeserie,
          contactsWithAtLeastOneGeoAddress
        )
      newTS = newTimeserie
      const foundPurpose = newTS?.aggregation?.purpose
      if (!foundPurpose) {
        // If no purpose found by addresses, try to find purpose by similar timeseries
        const newPurpose = await findPurposeFromSimilarTimeserieAndWaybacks(
          client,
          timeserie
        )
        if (newPurpose) {
          logService('info', `Found automatic purpose: ${newPurpose}`)
          // Set automatic purpose if a purpose is found in older similar timeserie
          newTS = setAutomaticPurpose(newTS, newPurpose)
          nTripsWithAutoPurpose++
        }
      }
      // Set recurring for trips without purpose, as they might be used for future purposes
      newTS = set(newTS, 'aggregation.recurring', true)
      timeseriesToUpdate.push(newTS)
      if (matchingStart) {
        matchingContactsInfo.push(matchingStart)
      }
      if (matchingEnd) {
        matchingContactsInfo.push(matchingEnd)
      }
    }
  }

  logService(
    'info',
    `Set ${nTripsWithAutoPurpose} trips with automatic purpose`
  )
  await saveContactsWithNewCoordinates({ client, matchingContactsInfo })
  return saveTrips({ client, timeseriesToUpdate, t })
}

/**
 * Look for similar trips to set the same purpose than the
 * given trip, after the user set a manual purpose
 *
 * @param {import("cozy-client/dist/index").CozyClient} client - The cozy-client instance
 * @param {object} params
 * @param {string} params.docId - The trip docId
 * @param {string} params.oldPurpose - The trip purpose before the manual change
 * @returns {Promise<Array<TimeSerie>>} The updated trips
 */
export const runRecurringPurposesForManualTrip = async (
  client,
  { docId, oldPurpose },
  t
) => {
  // A new purpose has been manually set: look for existing trips to update
  const timeserie = await queryTimeserieByDocId(client, docId)

  const timeseriesToUpdate = await findRecurringTripsFromTimeserie(
    client,
    timeserie,
    { oldPurpose }
  )
  logService('info', `Found ${timeseriesToUpdate.length} to update...`)
  return saveTrips({ client, timeseriesToUpdate, t })
}
