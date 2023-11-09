import React from 'react'
import BikeGoalDialogMobile from 'src/components/Goals/BikeGoal/BikeGoalDialogMobile'
import BikeGoalViewDesktop from 'src/components/Goals/BikeGoal/BikeGoalViewDesktop'
import { useAccountContext } from 'src/components/Providers/AccountProvider'
import {
  buildBikeCommuteTimeseriesQueryByAccountId,
  buildSettingsQuery
} from 'src/queries/queries'

import { isQueryLoading, useQueryAll, useQuery } from 'cozy-client'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

const Bikegoal = () => {
  const { account, isAccountLoading } = useAccountContext()
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

  const isTimeseriesQueryEnabled = timeseriesQuery.options.enabled
  const isLoadingTimeseriesQuery =
    isTimeseriesQueryEnabled &&
    (isQueryLoading(timeseriesQueryLeft) || timeseriesQueryLeft.hasMore)

  const isLoading =
    isLoadingTimeseriesQuery || isAccountLoading || isSettingsLoading

  if (isLoading) {
    return (
      <Spinner size="xxlarge" className="u-flex u-flex-justify-center u-mt-1" />
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
