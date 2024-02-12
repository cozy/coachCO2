import subDays from 'date-fns/subDays'
import { TRIPS_CHUNK_SIZE } from 'src/constants'
import { fetchAndSaveTrips, fetchTripsMetadata } from 'src/lib/openpath/lib'
import { saveAccountData } from 'src/lib/openpath/save'
import {
  getFirstAndLastTripTimestamp,
  requestOpenPathPurge
} from 'src/lib/openpath/traceRequests'
import {
  canSaveNextTripsChunk,
  restartService,
  createChunks
} from 'src/lib/openpath/utils'

import logger from 'cozy-logger'

const logService = logger.namespace('services/openpath')

/**
 * @typedef {import("cozy-client/dist/index").CozyClient} CozyClient
 * @typedef {import("cozy-client/types/types").IoCozyAccount} IoCozyAccount
 * @typedef {import('./types').TimeseriesGeoJSON} TimeseriesGeoJSON
 */

const getTimeout = () => {
  const maxExecutionTimeSeconds = parseInt(
    process.env.COZY_TIME_LIMIT || 180,
    10
  )
  return maxExecutionTimeSeconds - 50 // purely arbitrary
}

const startExecTime = new Date()

const isFirstRun = account => {
  return !account.data?.lastSavedTripDate
}

/**
 * Get the fetching starting date
 * @param {IoCozyAccount} account - The account to fetch
 * @returns {Date} - The starting date
 */
export const getStartingDate = async account => {
  const lastSavedTripDate = account.data?.lastSavedTripDate
  if (lastSavedTripDate) {
    return new Date(lastSavedTripDate)
  }
  const timestamps = await getFirstAndLastTripTimestamp(account.token)
  if (!timestamps.start_ts || !timestamps.end_ts) {
    return null
  }
  return new Date(timestamps.start_ts * 1000)
}

/**
 * Fetch trips from an openpath server
 *
 * @param {CozyClient} client - The cozy client instance
 * @param {IoCozyAccount} account  - The account to fetch
 * @param {Date} startDate - The date to start the fetching
 * @returns {number} The number of trips actually saved
 */
export const fetchTrips = async (client, account, startDate) => {
  logService('info', `Timeout is set to ${getTimeout()}s`)

  const device = account.auth.login
  const token = account.token
  const accountId = account._id
  let totalSavedTrips = 0
  const firstRun = isFirstRun(account)

  /* Extract the days having saved trips */
  logService('info', `Fetch trips metadata from ${startDate.toISOString()}`)
  const tripsMetadata = await fetchTripsMetadata(token, startDate, {
    excludeFirst: !firstRun
  })
  logService('info', `Trips metadata ${JSON.stringify(tripsMetadata)}`)

  /* Create chunks of trips to serialize execution */
  const tripChunks = createChunks(tripsMetadata, TRIPS_CHUNK_SIZE)
  logService('info', `${tripChunks.length} chunks of trips to save`)

  for (const chunk of tripChunks) {
    /* Fetch new trips from the start date and save them in geojson doctype */
    const { savedCount, lastSavedTripDate } = await fetchAndSaveTrips(
      client,
      token,
      chunk,
      {
        accountId,
        device
      }
    )
    totalSavedTrips += savedCount
    if (lastSavedTripDate) {
      logService('info', `Save last trip date : ${lastSavedTripDate}`)
      const accountData = account.data
      await saveAccountData(client, accountId, {
        ...accountData,
        lastSavedTripDate
      })
    }
    if (!canSaveNextTripsChunk(startExecTime, getTimeout())) {
      logService(
        'warn',
        `No time left to save the remaining trips, restart job.`
      )
      // Abort the execution to avoid timeout and restart the job
      await restartService(client)
      return totalSavedTrips
    }
  }

  return totalSavedTrips
}

/**
 * Request openpath server to purge data
 *
 * @param {IoCozyAccount} account -  The related account
 * @param {Date} date - The date before which data can be purged
 * @returns {Promise<OpenPathResponse>} The openpath server response
 */
export const purgeOpenPath = async (account, date) => {
  const beforeDate = subDays(date, 7).toISOString() // Remove 7 days for safety
  logService('info', `Request purge before date ${beforeDate}`)

  return requestOpenPathPurge(account.token, beforeDate)
}
