import { hasQueryBeenLoaded, isQueryLoading, useQuery } from 'cozy-client'

import { buildAggregatedTimeseriesQueryByAccountId } from 'src/queries/queries'
import { useAccountContext } from 'src/components/Providers/AccountProvider'

export const useTemporaryQueryForBikeGoal = () => {
  const { account, isAccountLoading } = useAccountContext()

  const timeseriesQuery = buildAggregatedTimeseriesQueryByAccountId({
    accountId: account?._id,
    limitBy: 50
  })

  const { data: timeseries, ...timeseriesQueryLeft } = useQuery(
    timeseriesQuery.definition,
    timeseriesQuery.options
  )

  const isLoadingTimeseriesQuery =
    isQueryLoading(timeseriesQueryLeft) &&
    !hasQueryBeenLoaded(timeseriesQueryLeft)

  const isLoadingOrEmpty =
    isAccountLoading ||
    !account ||
    isLoadingTimeseriesQuery ||
    timeseries.length === 0

  return {
    isLoadingTimeseriesQuery,
    timeseriesQueryLeft,
    isLoadingOrEmpty,
    timeseries
  }
}
