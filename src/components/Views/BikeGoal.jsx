import React from 'react'
import SpinnerOrEmptyContent from 'src/components/EmptyContent/SpinnerOrEmptyContent'
import BikeGoalDialogMobile from 'src/components/Goals/BikeGoal/BikeGoalDialogMobile'
import BikeGoalViewDesktop from 'src/components/Goals/BikeGoal/BikeGoalViewDesktop'
import { useAccountContext } from 'src/components/Providers/AccountProvider'
import {
  buildBikeCommuteTimeseriesQueryByAccountId,
  buildSettingsQuery
} from 'src/queries/queries'

import { isQueryLoading, useQueryAll, useQuery } from 'cozy-client'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

const Bikegoal = () => {
  const { account, accounts, isAccountLoading } = useAccountContext()
  const { isMobile } = useBreakpoints()

  const settingsQuery = buildSettingsQuery()
  const { data: settings, ...settingsQueryLeft } = useQuery(
    settingsQuery.definition,
    settingsQuery.options
  )
  const isSettingsLoading = isQueryLoading(settingsQueryLeft)

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
    isSettingsLoading ||
    isAccountLoading ||
    !account ||
    isLoadingTimeseriesQuery ||
    timeseries.length === 0

  if (isLoadingOrEmpty) {
    return (
      <SpinnerOrEmptyContent
        account={account}
        accounts={accounts}
        isAccountLoading={isAccountLoading}
        isTimeseriesLoading={isLoadingTimeseriesQuery}
        timeseries={timeseries}
      />
    )
  }

  const sendToDACC = !!settings?.[0].bikeGoal?.sendToDACC

  if (isMobile) {
    return (
      <BikeGoalDialogMobile
        timeseries={timeseries}
        timeseriesQueryLeft={timeseriesQueryLeft}
        sendToDACC={sendToDACC}
      />
    )
  }

  return (
    <BikeGoalViewDesktop
      timeseries={timeseries}
      timeseriesQueryLeft={timeseriesQueryLeft}
      sendToDACC={sendToDACC}
    />
  )
}

export default Bikegoal
