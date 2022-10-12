import React from 'react'

import { hasQueryBeenLoaded, isQueryLoading, useQuery } from 'cozy-client'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import {
  // buildOneYearBikeCommuteTimeseriesQueryByDateAndAccountId,
  buildAggregatedTimeseriesQueryByAccountId
} from 'src/queries/queries'
import { useAccountContext } from 'src/components/Providers/AccountProvider'
import SpinnerOrEmptyContent from 'src/components/SpinnerOrEmptyContent'
import BikeGoalDialogMobile from 'src/components/Goals/BikeGoal/BikeGoalDialogMobile'
import BikeGoalViewDesktop from 'src/components/Goals/BikeGoal/BikeGoalViewDesktop'

const Bikegoal = () => {
  const { account, isAccountLoading } = useAccountContext()
  const { isMobile } = useBreakpoints()

  // TODO: uncomment this when the request return something
  // const timeseriesQuery =
  //   buildOneYearBikeCommuteTimeseriesQueryByDateAndAccountId(
  //     {
  //       date: new Date(),
  //       accountId: account?._id
  //     },
  //     Boolean(account)
  //   )

  // TODO: remove this request when the first one works
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
