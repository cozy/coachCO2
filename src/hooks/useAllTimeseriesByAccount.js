import { isQueryLoading, useQuery } from 'cozy-client'

import { useAccountContext } from 'src/components/Providers/AccountProvider'
import {
  buildTimeseriesQueryByAccountIdNoLimit,
  buildAccountQuery
} from 'src/queries/queries'

const useAllTimeseriesByAccount = () => {
  const { selectedAccount } = useAccountContext()

  const accountQuery = buildAccountQuery()
  const { data: accounts, ...accountQueryRes } = useQuery(
    accountQuery.definition,
    accountQuery.options
  )

  const isAccountLoading = isQueryLoading(accountQueryRes)

  const account = isAccountLoading ? null : selectedAccount || accounts[0]

  const timeserieQuery = buildTimeseriesQueryByAccountIdNoLimit(account?._id)
  const { data: timeseries, ...timeseriesQueryResult } = useQuery(
    timeserieQuery.definition,
    {
      ...timeserieQuery.options,
      enabled: !isAccountLoading
    }
  )

  const isAllQueriesLoading =
    isAccountLoading || isQueryLoading(timeseriesQueryResult)

  return { timeseries, isLoading: isAllQueriesLoading }
}

export default useAllTimeseriesByAccount