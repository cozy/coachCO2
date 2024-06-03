import { COORDINATES_DISTANCE_THRESHOLD_M } from 'src/constants'
import {
  getEndPlaceCoordinates,
  getStartPlaceCoordinates
} from 'src/lib/timeseries'

import { geodesicDistance } from 'cozy-client/dist/models/geo'

/**
 * @typedef {import('./types').TimeseriesGeoJSON} TimeSerie
 * @typedef {import('./types').Contact} Contact
 * @typedef {import('./types').Address} Address
 */

/**
 * Find the closest addresses related to a start and end place
 *
 * @typedef StartAndEndClosestAddress
 * @property {Address} matchingStart
 * @property {Address} matchingEnd
 *
 * @param {TimeSerie} timeserie - The timeserie with start and end place coordinates
 * @param {Array<Contact>} contacts - The list of contacts to search for an address
 * @returns {StartAndEndClosestAddress} The closest addresses for start and end place
 */
export const findClosestStartAndEndContactsAddress = (timeserie, contacts) => {
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

/**
 *
 * For a timeserie, find a matching contact address for start and end place.
 * A matching address has the closest coordinates and is below a distance threshold.
 *
 * @typedef StartAndEndMatchingAddress
 * @property {Address} matchingStart
 * @property {Address} matchingEnd
 *
 * @param {TimeSerie} timeserie - The timeserie with start and end place coordinates
 * @param {Array<Contact>} contacts - The list of contacts to search for an address
 * @returns {StartAndEndMatchingAddress} The matching start and end addresses
 */
export const findMatchingStartAndEnd = (timeserie, contacts) => {
  const { closestStart, closestEnd } = findClosestStartAndEndContactsAddress(
    timeserie,
    contacts
  )
  let matchingStart = null,
    matchingEnd = null
  if (closestStart?.distance < COORDINATES_DISTANCE_THRESHOLD_M) {
    matchingStart = closestStart
  }
  if (closestEnd?.distance < COORDINATES_DISTANCE_THRESHOLD_M) {
    matchingEnd = closestEnd
  }
  return { matchingStart, matchingEnd }
}

/**
 *
 * Try to find a contact address matching the given timeserie start or end place.
 *
 * @typedef {Object} params
 * @property {TimeSerie} - The timeserie to extract start and end coordinates
 * @property {Contact} - The contact containing the address to find a matching
 * @property {startOrEnd} - Either 'start' or 'end'. Specifiy if it should find a matching on the trip start or end
 * @param Params
 * @returns { Address} - The matching contact address
 */
export const findMatchingContactAddressForTimeserie = ({
  timeserie,
  contact,
  startOrEnd
}) => {
  const { matchingStart, matchingEnd } = findMatchingStartAndEnd(timeserie, [
    contact
  ])
  if (startOrEnd === 'start') {
    return matchingStart?.address || null
  } else if (startOrEnd === 'end') {
    return matchingEnd?.address || null
  }
  return null
}
