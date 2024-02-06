import { keepOnlyNewTrips } from 'src/lib/openpath/utils'
import { queryAccountByDocId } from 'src/queries/nodeQueries'

import { queryTimeseriesByRange } from './queries'

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
  if (tripsToSave.length > 0) {
    await client.saveAll(tripsToSave)
  }
}

export const saveAccountData = async (client, accountId, accountData) => {
  const account = await queryAccountByDocId(client, accountId)
  return client.save({ ...account, data: accountData })
}
