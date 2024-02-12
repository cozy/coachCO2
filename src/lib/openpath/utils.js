import { chunk, differenceWith } from 'lodash'

export const canSaveNextTripsChunk = (startExecTime, timeout) => {
  const executionTimeSeconds = (new Date() - startExecTime) / 1000
  return executionTimeSeconds < timeout
}

export const restartKonnector = async (client, accountId) => {
  const args = {
    konnector: 'openpath',
    account: accountId
  }

  const jobCollection = client.collection('io.cozy.jobs')
  return jobCollection.create('konnector', args)
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
