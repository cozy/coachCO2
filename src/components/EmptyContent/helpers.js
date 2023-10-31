import { buildHasTimeseriesQueryByAccountId } from 'src/queries/queries'

export const makeQueriesByAccountsId = accounts => {
  const accountsIds = accounts.map(account => account._id)

  const queriesByAccountsId = accountsIds.reduce((prev, current) => {
    const query = buildHasTimeseriesQueryByAccountId(current)
    prev[current] = { ...query.options, query: query.definition }
    return prev
  }, {})

  return queriesByAccountsId
}
