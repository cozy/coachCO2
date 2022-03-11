import { buildTimeseriesQueryByAccountId } from 'src/queries/queries'

export const fetchTimeseries = async (client, account) => {
  const timeserieQuery = buildTimeseriesQueryByAccountId({
    accountId: account._id,
    limit: 1000
  })
  const { data } = await client.fetchQueryAndGetFromState({
    definition: timeserieQuery.definition,
    options: timeserieQuery.options
  })

  return data
}
