import React from 'react'

import { isQueryLoading, useQueryAll } from 'cozy-client'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import { useAccountContext } from 'src/components/Providers/AccountProvider'
import SpinnerOrEmptyContent from 'src/components/SpinnerOrEmptyContent'
import BikeGoalDialogMobile from 'src/components/Goals/BikeGoal/BikeGoalDialogMobile'
import BikeGoalViewDesktop from 'src/components/Goals/BikeGoal/BikeGoalViewDesktop'
import { buildBikeCommuteTimeseriesQueryByAccountId } from 'src/queries/queries'

const Bikegoal = () => {
  const { account, isAccountLoading } = useAccountContext()
  const { isMobile } = useBreakpoints()

  const timeseriesQuery = buildBikeCommuteTimeseriesQueryByAccountId(
    { accountId: account?._id },
    Boolean(account)
  )
  const { data: timeseries, ...timeseriesQueryLeft } = useQueryAll(
    timeseriesQuery.definition,
    timeseriesQuery.options
  )

  const isLoadingTimeseriesQuery =
    isQueryLoading(timeseriesQueryLeft) || timeseriesQueryLeft.hasMore

  const isLoadingOrEmpty =
    isAccountLoading ||
    !account ||
    isLoadingTimeseriesQuery ||
    timeseries.length === 0

  if (isLoadingOrEmpty) {
    return (
      <SpinnerOrEmptyContent
        account={account}
        isAccountLoading={isAccountLoading}
        isQueryLoading={isLoadingTimeseriesQuery}
        timeseries={timeseries}
      />
    )
  }

  if (isMobile) {
    return (
      <BikeGoalDialogMobile
        timeseries={timeseries}
        timeseriesQueryLeft={timeseriesQueryLeft}
      />
    )
  }

  return (
    <BikeGoalViewDesktop
      timeseries={timeseries}
      timeseriesQueryLeft={timeseriesQueryLeft}
    />
  )
}

export default Bikegoal
