import { OPENPATH_URL } from 'src/constants'

/**
 * @typedef {import("src/lib/types").OpenPathTrip} OpenPathTrip
 */

/**
 * The OpenPath server response
 *
 * @typedef {object} OpenPathResponse
 * @property {Array<OpenPathTrip>} phone_data - The server collection response
 * @property {Array<OpenPathTrip>} timeline - The timeline response
 * @property {number} start_ts - The start timestamp
 */

class HTTPResponseError extends Error {
  constructor(response) {
    super(`HTTP Error Response: ${response.status} ${response.statusText}`)
    this.response = response
    this.status = response.status
  }
}

/**
 * Get first and last trip dates
 *
 * @param {string} token - The user token
 * @returns {Promise<object>} - The first and last trip timestamps
 */
export const getFirstAndLastTripTimestamp = async token => {
  const url = `${OPENPATH_URL}/pipeline/get_range_ts`
  const body = {
    user: token
  }
  return requestOpenPath(url, body)
}

/**
 * Get database collection on a time range
 *
 * @typedef RequestOptions
 * @property {Date} startDate - The starting date request
 * @property {string} collection - The collection name
 * @property {boolean} excludeFirst - Whether or not the first result should be skipped
 *
 * @param {string} token - The user token
 * @param {RequestOptions} options - The request options
 * @returns {Promise<object>} - The request results
 */
export const getServerCollectionFromDate = async (
  token,
  { startDate, collection, excludeFirst = true }
) => {
  // Note the expected timestamp is in seconds
  const startTime = startDate.getTime() / 1000
  const endTime = Date.now() / 1000
  const body = {
    user: token,
    start_time: startTime,
    end_time: endTime,
    key_list: [collection]
  }
  const url = `${OPENPATH_URL}/datastreams/find_entries/timestamp`
  const results = await requestOpenPath(url, body)
  return excludeFirst ? results.phone_data.slice(1) : results.phone_data
}

/**
 * Get the full trips for a day
 *
 * @param {string} token - The user token
 * @param {string} day - The day on a YYYY-MM-DD format
 * @returns {Promise<object>} - The full trips for this day
 */
export const getTripsForDay = async (token, day) => {
  const url = `${OPENPATH_URL}/timeline/getTrips/${day}`
  const body = {
    user: token
  }
  const trips = await requestOpenPath(url, body)
  return trips.timeline
}

/**
 * Request openpath purge
 *
 * @param {string} token - The account token
 * @param {string} beforeDate - The date before which data can be purged
 * @returns {Promise<OpenPathResponse>} The openpath server response
 */
export const requestOpenPathPurge = async (token, beforeDate) => {
  const url = `${OPENPATH_URL}/cozy/run/purge`
  const body = {
    user: token,
    before_date: beforeDate
  }
  return requestOpenPath(url, body)
}

/**
 * Request the OpenPath server
 *
 * @param {string} url - The openpath url to request
 * @param {object} body - The request body containing the user token
 * @returns {Promise<OpenPathResponse>} The openpath server response
 */
const requestOpenPath = async (url, body) => {
  const response = await fetch(url, {
    method: 'post',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' }
  })
  if (!response.ok) {
    throw new HTTPResponseError(response)
  }
  const data = await response.json()
  return data
}
