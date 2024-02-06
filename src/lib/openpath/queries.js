import {
  buildTimeseriesByDateRange,
  buildAccountByToken
} from 'src/queries/nodeQueries'
import { buildLastCreatedServiceAccountQuery } from 'src/queries/queries'

export const queryLastServiceAccount = async client => {
  const accountsQuery = buildLastCreatedServiceAccountQuery().definition
  const account = await client.query(accountsQuery)
  return account && account.data?.length > 0 ? account.data[0] : null
}

export const queryAccountByToken = async (client, token) => {
  const accountsQuery = buildAccountByToken({ token }).definition
  const account = await client.query(accountsQuery)
  return account && account.data?.length > 0 ? account.data[0] : null
}

export const queryTripsByRange = async (
  client,
  { trips, accountId, limit = 100 }
) => {
  const firstDate = trips[0].properties.start_fmt_time
  const lastDate = trips[trips.length - 1].properties.start_fmt_time
  const query = buildTimeseriesByDateRange({
    firstDate,
    lastDate,
    accountId,
    limit
  }).definition
  return client.queryAll(query)
}
