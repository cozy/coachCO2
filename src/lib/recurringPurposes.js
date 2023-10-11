import { set } from 'lodash'
import {
  COMMUTE_PURPOSE,
  HOME_ADDRESS_CATEGORY,
  OTHER_PURPOSE,
  WORK_ADDRESS_CATEGORY
} from 'src/constants'
import { CONTACTS_DOCTYPE } from 'src/doctypes'
import {
  getEndPlaceCoordinates,
  getStartPlaceCoordinates,
  setAutomaticPurpose
} from 'src/lib/timeseries'
import { getManualPurpose, getAutomaticPurpose } from 'src/lib/trips'
import {
  buildContactsWithGeoCoordinates,
  buildNewestRecurringTimeseriesQuery,
  buildRecurringTimeseriesByStartAndEndPointRange,
  buildSettingsQuery,
  buildTimeseriesQueryByAccountIdAndDate,
  queryContactByDocId,
  queryTimeserieByDocId
} from 'src/queries/queries'

import { models } from 'cozy-client'
import log from 'cozy-logger'

const { deltaLatitude, deltaLongitude, geodesicDistance } = models.geo

const MAX_SPATIAL_THRESHOLD_M = 200

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

export const findClosestStartAndEnd = (timeserie, contacts) => {
  const startCoordinates = getStartPlaceCoordinates(timeserie)
  const endCoordinates = getEndPlaceCoordinates(timeserie)
  let closestStart = {},
    closestEnd = {}
  let minStartDistance = Number.MAX_SAFE_INTEGER,
    minEndDistance = Number.MAX_SAFE_INTEGER
  for (const contact of contacts) {
    for (const address of contact.address) {
      if (!address?.geo?.geo) {
        continue
      }
      const addressCoordinates = {
        lon: address.geo.geo[0],
        lat: address.geo.geo[1]
      }
      const startPlaceDistance = geodesicDistance(
        startCoordinates,
        addressCoordinates
      )

      const endPlaceDistance = geodesicDistance(
        endCoordinates,
        addressCoordinates
      )

      if (startPlaceDistance < minStartDistance) {
        closestStart = {
          distance: startPlaceDistance,
          contact,
          address,
          newCoordinates: startCoordinates
        }
        minStartDistance = startPlaceDistance
      }
      if (endPlaceDistance < minEndDistance) {
        closestEnd = {
          distance: endPlaceDistance,
          contact,
          address,
          newCoordinates: endCoordinates
        }
        minEndDistance = endPlaceDistance
      }
    }
  }
  return { closestStart, closestEnd }
}

const setAddressContactRelationShip = ({
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
    newContact = await client.save(contactToUpdate)
  } catch (err) {
    if (err.status === 409) {
      log('info', 'Got conflict on contact update... Retry...')
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
  let addressIdx = -1
  for (let i = 0; newContact.address.length; i++) {
    if (newContact.address[i].id === addressId) {
      addressIdx = i
      break
    }
  }
  if (addressIdx < 0) {
    log('warn', `No address ${addressId} found on contact ${contact._id}`)
    return null
  }

  const currCoordinates = newContact.address[addressIdx].geo?.geo
  const currCount = newContact.address[addressIdx].geo?.count || 0
  const currSum = newContact.address[addressIdx].geo?.sum || [0, 0]
  const newSumLon = currSum[0] + newCoordinates.lon
  const newSumLat = currSum[1] + newCoordinates.lat

  if (!currCoordinates) {
    newContact.address[addressIdx].geo.geo = [
      newCoordinates.lon,
      newCoordinates.lat
    ]
  } else {
    // XXX - This is an incremental average of longitudes and latitudes, that does not
    // take into consideration of curvature of the Earth. Hence, this is an approximation.
    // We consider this is acceptable as the coordinates are supposed to be very close, i.e. few meters.
    // For more precise computations, one should typically use a geodesic center of all the points.

    const count = currCount + 1
    const avgLon = newSumLon / count
    const avgLat = newSumLat / count

    newContact.address[addressIdx].geo.geo = [avgLon, avgLat]
    log('info', `New address coordinates set : ${[avgLon, avgLat]}`)
    log(
      'info',
      `Distance from previous coordinates: ${geodesicDistance(
        { lon: currCoordinates[0], lat: currCoordinates[1] },
        { lon: newCoordinates.lon, lat: newCoordinates.lat }
      )}`
    )
  }

  newContact.address[addressIdx].geo.count = currCount + 1
  newContact.address[addressIdx].geo.sum = [newSumLon, newSumLat]
  log(
    'info',
    `Update contact ${contact.displayName} on address ${contact.address[addressIdx].formattedAddress}`
  )
  return newContact
}

export const findStartAndEnd = (timeserie, contacts) => {
  const { closestStart, closestEnd } = findClosestStartAndEnd(
    timeserie,
    contacts
  )
  let matchingStart = null,
    matchingEnd = null
  if (closestStart?.distance < MAX_SPATIAL_THRESHOLD_M) {
    matchingStart = closestStart
  }
  if (closestEnd?.distance < MAX_SPATIAL_THRESHOLD_M) {
    matchingEnd = closestEnd
  }
  return { matchingStart, matchingEnd }
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
  return distance < MAX_SPATIAL_THRESHOLD_M
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
 * @param {Array<import('./types').TimeseriesGeoJSON>} timeseries - The timeseries to filter
 * @returns {Array<import('./types').TimeseriesGeoJSON>} The filtered timeseries
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
 * @param {Array<import('./types').TimeseriesGeoJSON>} timeseries - The timeseries to filter
 * @param {string} purpose - The searched purpose
 * @returns {Array<import('./types').TimeseriesGeoJSON>} The filtered timeseries
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
  { accountId, startCoord, endCoord }
) => {
  const deltaLat = deltaLatitude(MAX_SPATIAL_THRESHOLD_M)
  const deltaLon = deltaLongitude(deltaLat, MAX_SPATIAL_THRESHOLD_M)

  const minLonStart = startCoord.lon - deltaLon
  const maxLonStart = startCoord.lon + deltaLon
  const minLatStart = startCoord.lat - deltaLon
  const maxLatStart = startCoord.lat + deltaLon

  const minLonEnd = endCoord.lon - deltaLon
  const maxLonEnd = endCoord.lon + deltaLon
  const minLatEnd = endCoord.lat - deltaLon
  const maxLatEnd = endCoord.lat + deltaLon

  const queryDef = buildRecurringTimeseriesByStartAndEndPointRange({
    accountId,
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

// Similar trips = close start/end point

/**
 * Find similar recurring timeseries, notably based on their coordinates.
 *
 * @typedef Options
 * @property {boolean} isWayBack -Whether or not the start and end should be reversed
 * @property {string} oldPurpose - The previous purpose of the timeserie
 *
 * @param {Object} client - The cozy client instance
 * @param {import('./types').TimeseriesGeoJSON} timeserie - The timeserie to find similar ones
 * @param {Options} options
 * @returns {Promise<Array<import('./types').TimeseriesGeoJSON>>}
 */
export const findSimilarRecurringTimeseries = async (
  client,
  timeserie,
  { isWayBack = false, oldPurpose } = {}
) => {
  const accountId = timeserie?.cozyMetadata?.sourceAccount
  const startCoord = isWayBack
    ? getEndPlaceCoordinates(timeserie)
    : getStartPlaceCoordinates(timeserie)
  const endCoord = isWayBack
    ? getStartPlaceCoordinates(timeserie)
    : getEndPlaceCoordinates(timeserie)

  if (!accountId || !startCoord || !endCoord) {
    log(
      'error',
      `Missing attributes to run similar trip query for trip ${timeserie._id}`
    )
    return []
  }

  const results = await queryRecurringTimeseriesWithCloseStartOrEnd(client, {
    accountId,
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

export const findPurposeFromSimilarTimeserieAndWaybacks = async (
  client,
  timeserie
) => {
  const similarTimeseries = await findSimilarRecurringTimeseries(
    client,
    timeserie
  )
  log('info', `Found ${similarTimeseries.length} similar timeseries`)

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
    log('info', `Found ${waybackTimeseries.length} wayback timeseries`)
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
 * @param {Object} client - The cozy client instance
 * @param {import('./types').TimeseriesGeoJSON} timeserie - The timeserie to categorize
 * @param {Array<import('./types').Contact>} contacts - The contacts with geo information
 * @returns {import('./types').TimeseriesGeoJSON} The timeserie to update
 */
const findPurposeFromContactAddresses = async (client, timeserie, contacts) => {
  const { matchingStart, matchingEnd } = await findStartAndEnd(
    timeserie,
    contacts
  )
  let newTimeserie = { ...timeserie }
  if (!matchingStart && !matchingEnd) {
    log('info', 'No matching start and end places for this trip')
    return newTimeserie
  }

  if (matchingStart) {
    log('info', 'Found a matching start place: add relationship')
    newTimeserie = setAddressContactRelationShip({
      timeserie: newTimeserie,
      contact: matchingStart.contact,
      addressId: matchingStart.address.id,
      relType: 'startPlaceContact'
    })
    // Update contact start address
    await updateAddressCoordinates({
      client,
      newCoordinates: matchingStart.newCoordinates,
      contact: matchingStart.contact,
      addressId: matchingStart.address.id
    })
  }
  if (matchingEnd) {
    log('info', 'Found a matching end place: add relationship')
    newTimeserie = setAddressContactRelationShip({
      timeserie: newTimeserie,
      contact: matchingEnd.contact,
      addressId: matchingEnd.address.id,
      relType: 'endPlaceContact'
    })
    // Update contact end address
    await updateAddressCoordinates({
      client,
      newCoordinates: matchingEnd.newCoordinates,
      contact: matchingEnd.contact,
      addressId: matchingEnd.address.id
    })
  }

  if (shouldSetCommutePurpose(matchingStart, matchingEnd)) {
    log(
      'info',
      `Set COMMUTE purpose for trip ${timeserie._id} because of similar start and end places`
    )
    newTimeserie = setAutomaticPurpose(newTimeserie, COMMUTE_PURPOSE)
  }
  return newTimeserie
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
  // Find similar trips
  const similarTimeseries = await findSimilarRecurringTimeseries(
    client,
    timeserie,
    {
      oldPurpose
    }
  )
  log('info', `Found ${similarTimeseries.length} similar timeseries`)
  // Find similar wayback trips
  const similarWaybackTimeseries = await findSimilarRecurringTimeseries(
    client,
    timeserie,
    {
      oldPurpose,
      isWayBack: true
    }
  )
  log(
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
 * @param {Object} client - The cozy-client instance
 * @returns {Promise<Array<import('./types').TimeseriesGeoJSON>>} The updated trips
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

  if (timeseries.length > 0) {
    const contactsWithGeo = await findContactsWithGeo(client)
    log('info', `Found ${contactsWithGeo.length} contacts with geo info`)

    for (const timeserie of timeseries) {
      log('info', `Try to set a recurring purpose to ${timeserie._id}...`)
      let newTS
      // First, try to find purpose by contact's addresses
      newTS = await findPurposeFromContactAddresses(
        client,
        timeserie,
        contactsWithGeo
      )
      const foundPurpose = newTS?.aggregation?.purpose
      if (!foundPurpose) {
        // If no purpose found by addresses, try to find purpose by similar timeseries
        const newPurpose = await findPurposeFromSimilarTimeserieAndWaybacks(
          client,
          timeserie
        )
        if (newPurpose) {
          log('info', `Found automatic purpose: ${newPurpose}`)
          // Set automatic purpose if a purpose is found in older similar timeserie
          newTS = setAutomaticPurpose(newTS, newPurpose)
          nTripsWithAutoPurpose++
        }
      }
      // Set recurring for trips without purpose, as they might be used for future purposes
      newTS = set(newTS, 'aggregation.recurring', true)
      timeseriesToUpdate.push(newTS)
    }
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
 * @returns {Promise<Array<import('./types').TimeseriesGeoJSON>>} The updated trips
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
  log('info', `Found ${timeseriesToUpdate.length} to update...`)
  return saveTrips(client, timeseriesToUpdate)
}
