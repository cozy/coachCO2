import { chunk, differenceWith } from 'lodash'
import { FETCH_TRIPS_SERVICE_NAME } from 'src/constants'

export const canSaveNextTripsChunk = (startExecTime, timeout) => {
  const executionTimeSeconds = (new Date() - startExecTime) / 1000
  return executionTimeSeconds < timeout
}

export const restartService = async client => {
  const args = {
    name: FETCH_TRIPS_SERVICE_NAME,
    slug: 'coachco2'
  }

  const jobCollection = client.collection('io.cozy.jobs')
  return jobCollection.create('service', args)
}

export const createChunks = (tripsMetadata, chunkSize) => {
  return chunk(tripsMetadata, chunkSize)
}

export const keepOnlyNewTrips = async ({ incomingTrips, existingTrips }) => {
  if (incomingTrips.length < 1) {
    return []
  }

  const tripsToSave = differenceWith(incomingTrips, existingTrips, trip => {
    const duplicate = existingTrips.find(existingTrip => {
      const newTrip = trip.series[0]
      return (
        new Date(newTrip.properties.start_fmt_time).getTime() ===
          new Date(existingTrip.startDate).getTime() &&
        new Date(newTrip.properties.end_fmt_time).getTime() ===
          new Date(existingTrip.endDate).getTime()
      )
    })
    return duplicate
  })
  return tripsToSave
}
