import { TRIPS_CHUNK_SIZE } from 'src/constants'
import { fetchAndSaveTrips, fetchTripsMetadata } from 'src/lib/openpath/lib'
import { saveAccountData } from 'src/lib/openpath/save'
import { getFirstAndLastTripTimestamp } from 'src/lib/openpath/traceRequests'
import {
  canSaveNextTripsChunk,
  restartKonnector,
  createChunks
} from 'src/lib/openpath/utils'

import logger from 'cozy-logger'

const logService = logger.namespace('services/openpath')

const getTimeout = () => {
  const maxExecutionTimeSeconds = parseInt(
    process.env.COZY_TIME_LIMIT || 180,
    10
  )
  return maxExecutionTimeSeconds - 50 // purely arbitrary
}

const startExecTime = new Date()

export const fetchTrips = async (client, account) => {
  logService('info', `Timeout is set to ${getTimeout()}s`)

  const device = account.auth.login
  const token = account.token
  const accountId = account._id
  /* Get the trips starting date */
  let startDate
  let startManualDate
  let firstRun = false
  try {
    const lastSavedTripDate = account.data?.lastSavedTripDate
    if (lastSavedTripDate) {
      startDate = new Date(lastSavedTripDate)
    }
    if (!startDate) {
      const timestamps = await getFirstAndLastTripTimestamp(token)
      if (!timestamps.start_ts || !timestamps.end_ts) {
        logService('info', 'No trip saved yet. Abort.')
        return
      }
      startDate = new Date(timestamps.start_ts * 1000)
      firstRun = true
    }
    if (!startManualDate) {
      startManualDate = startDate
    }

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
      const lastSavedTripDate = await fetchAndSaveTrips(client, token, chunk, {
        accountId,
        device
      })
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
          'info',
          `No time left to save the remaining trips, restart job.`
        )
        // Abort the execution to avoid timeout and restart the job
        await restartKonnector(client, accountId)
        return
      }
    }

    if (!canSaveNextTripsChunk(startExecTime, getTimeout())) {
      logService(
        'info',
        `No time left to save the manual entries, restart job.`
      )
      // Abort the execution to avoid timeout and restart the job
      await restartKonnector(client, accountId)
      return
    }
  } catch (err) {
    logService.error('Error during execution: ', err.message)
    return
  }
}
