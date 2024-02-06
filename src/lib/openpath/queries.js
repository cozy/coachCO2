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

export const queryTimeseriesByRange = async (
  client,
  { timeseries, accountId, limit = 100 }
) => {
  const firstDate = timeseries[0].startDate
  const lastDate = timeseries[timeseries.length - 1].startDate
  const query = buildTimeseriesByDateRange({
    firstDate,
    lastDate,
    accountId,
    limit
  }).definition
  return client.queryAll(query)
}
