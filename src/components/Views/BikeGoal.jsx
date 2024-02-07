import React from 'react'
import BikeGoalDialogMobile from 'src/components/Goals/BikeGoal/BikeGoalDialogMobile'
import BikeGoalViewDesktop from 'src/components/Goals/BikeGoal/BikeGoalViewDesktop'
import { useAccountContext } from 'src/components/Providers/AccountProvider'
import {
  buildBikeCommuteTimeseriesQueryByAccountId,
  buildBikeCommuteTimeseriesQuery,
  buildSettingsQuery
} from 'src/queries/queries'

import { isQueryLoading, useQueryAll, useQuery } from 'cozy-client'
import ListSkeleton from 'cozy-ui/transpiled/react/Skeletons/ListSkeleton'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

const getQuery = ({ isAllAccountsSelected, accountId }) => {
  if (isAllAccountsSelected) {
    return buildBikeCommuteTimeseriesQuery()
  }
  return buildBikeCommuteTimeseriesQueryByAccountId({ accountId })
}

const Bikegoal = () => {
  const { account, isAccountLoading, isAllAccountsSelected } =
    useAccountContext()
  const { isMobile } = useBreakpoints()

  const settingsQuery = buildSettingsQuery()
  const { data: settings, ...settingsQueryLeft } = useQuery(
    settingsQuery.definition,
    settingsQuery.options
  )
  const isSettingsLoading = isQueryLoading(settingsQueryLeft)

  const timeseriesQuery = getQuery({
    accountId: account?._id,
    isAllAccountsSelected
  })
  const { data: timeseries, ...timeseriesQueryLeft } = useQueryAll(
    timeseriesQuery.definition,
    {
      ...timeseriesQuery.options,
      enabled: Boolean(account) || isAllAccountsSelected
    }
  )

  const isTimeseriesQueryEnabled = timeseriesQuery.options.enabled
  const isLoadingTimeseriesQuery =
    isTimeseriesQueryEnabled &&
    (isQueryLoading(timeseriesQueryLeft) || timeseriesQueryLeft.hasMore)

  const isLoading =
    isLoadingTimeseriesQuery || isAccountLoading || isSettingsLoading

  if (isLoading) {
    return <ListSkeleton count={8} hasSecondary divider />
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
