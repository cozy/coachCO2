import React from 'react'

import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import { useAccountContext } from 'src/components/Providers/AccountProvider'
import SpinnerOrEmptyContent from 'src/components/SpinnerOrEmptyContent'
import BikeGoalDialogMobile from 'src/components/Goals/BikeGoal/BikeGoalDialogMobile'
import BikeGoalViewDesktop from 'src/components/Goals/BikeGoal/BikeGoalViewDesktop'
import { useTemporaryQueryForBikeGoal } from 'src/components/Goals/useTemporaryQueryForBikeGoal'

const Bikegoal = () => {
  const { account, isAccountLoading } = useAccountContext()
  const { isMobile } = useBreakpoints()
  // TODO: uncomment this when the request return something
  //
  // const { date } = useBikeGoalDateContext()
  // const timeseriesQuery =
  //   buildOneYearBikeCommuteTimeseriesQueryByDateAndAccountId(
  //     {
  //       date,
  //       accountId: account?._id
  //     },
  //     Boolean(account)
  //   )

  // TODO: remove this hooks when the above request will work
  const {
    timeseries,
    timeseriesQueryLeft,
    isLoadingTimeseriesQuery,
    isLoadingOrEmpty
  } = useTemporaryQueryForBikeGoal()

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
