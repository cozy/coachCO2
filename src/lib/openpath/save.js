import { keepOnlyNewTrips } from 'src/lib/openpath/utils'
import { queryAccountByDocId } from 'src/queries/nodeQueries'

import logger from 'cozy-logger'

import { queryTimeseriesByRange } from './queries'

const logService = logger.namespace('services/openpath')

/**
 * @typedef {import("cozy-client/dist/index").CozyClient} CozyClient
 * @typedef {import('./types').TimeseriesGeoJSON} TimeseriesGeoJSON
 */

/**
 *
 * @typedef Params
 * @property {string} accountId - The account id
 *
 * @param {CozyClient} client - The cozy-client instance
 * @param {Array<TimeseriesGeoJSON>} trips - The trips to save
 * @param {Params} {accountId} - Additional params
 * @returns {number} The number of trips actually saved
 */
export const saveTrips = async (client, trips, { accountId }) => {
  // Deduplication
  const existingTrips = await queryTimeseriesByRange(client, {
    timeseries: trips,
    accountId
  })
  const tripsToSave = await keepOnlyNewTrips({
    incomingTrips: trips,
    existingTrips
  })
  if (tripsToSave.length != trips.length) {
    logService(
      'info',
      `${trips.length - tripsToSave.length} duplicates found and excluded`
    )
  }
  if (tripsToSave.length > 0) {
    await client.saveAll(tripsToSave)
  } else {
    logService('info', `No trips to save`)
  }
  return tripsToSave.length
}

export const saveAccountData = async (client, accountId, accountData) => {
  const account = await queryAccountByDocId(client, accountId)
  return client.save({ ...account, data: accountData })
}
