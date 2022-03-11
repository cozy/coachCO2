import { isQueryLoading, useQuery } from 'cozy-client'

import { useAccountContext } from 'src/components/Providers/AccountProvider'
import { buildTimeseriesQueryByAccountIdNoLimit } from 'src/queries/queries'

const useAllTimeseriesByAccount = () => {
  const { account } = useAccountContext()

  const timeserieQuery = buildTimeseriesQueryByAccountIdNoLimit(account?._id)
  const { data: timeseries, ...timeseriesQueryResult } = useQuery(
    timeserieQuery.definition,
    {
      ...timeserieQuery.options,
      enabled: Boolean(account)
    }
  )

  const isAllQueriesLoading = !account || isQueryLoading(timeseriesQueryResult)

  return { timeseries, isLoading: isAllQueriesLoading }
}

export default useAllTimeseriesByAccount
