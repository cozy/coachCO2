import React from 'react'
import { useNavigate } from 'react-router-dom'

import { hasQueryBeenLoaded, isQueryLoading, useQuery } from 'cozy-client'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import {
  // buildOneYearBikeCommuteTimeseriesQueryByDateAndAccountId,
  buildAggregatedTimeseriesQueryByAccountId
} from 'src/queries/queries'
import { useAccountContext } from 'src/components/Providers/AccountProvider'
import SpinnerOrEmptyContent from 'src/components/SpinnerOrEmptyContent'
import Titlebar from 'src/components/Titlebar'
import BikeGoalList from 'src/components/Goals/BikeGoal/BikeGoalList'
import BikeGoalDialogMobile from 'src/components/Goals/BikeGoal/BikeGoalDialogMobile'
import BikeGoalAchievement from 'src/components/Goals/BikeGoal/BikeGoalAchievement'
import BikeGoalChart from 'src/components/Goals/BikeGoal/BikeGoalChart'

const Bikegoal = () => {
  const { account, isAccountLoading } = useAccountContext()
  const { t } = useI18n()
  const navigate = useNavigate()
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
    <>
      <Titlebar
        label={t('bikeGoal.title')}
        subtitle={<BikeGoalAchievement timeseries={timeseries} />}
        onBack={() => navigate('/')}
      />
      <BikeGoalChart
        className="u-flex u-flex-justify-end u-pos-absolute u-top-xl u-right-xl"
        timeseries={timeseries}
      />
      <BikeGoalList
        className="u-mt-3"
        timeseries={timeseries}
        hasMore={timeseriesQueryLeft.hasMore}
        fetchMore={timeseriesQueryLeft.fetchMore}
      />
    </>
  )
}

export default Bikegoal
