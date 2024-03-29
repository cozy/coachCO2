import React from 'react'
import CO2EmissionsChart from 'src/components/CO2EmissionsChart/CO2EmissionsChart'
import CO2EmissionDaccManager from 'src/components/DaccManager/CO2EmissionDaccManager'
import EmptyContentManager from 'src/components/EmptyContent/EmptyContentManager'
import BikeGoalManager from 'src/components/Goals/BikeGoal/BikeGoalManager'
import { useAccountContext } from 'src/components/Providers/AccountProvider'
import Titlebar from 'src/components/Titlebar'
import TripsList from 'src/components/TripsList'
import {
  buildAggregatedTimeseriesQuery,
  buildAggregatedTimeseriesQueryByAccountLogin
} from 'src/queries/queries'

import { hasQueryBeenLoaded, isQueryLoading, useQuery } from 'cozy-client'
import flag from 'cozy-flags'
import Divider from 'cozy-ui/transpiled/react/Divider'
import LoadMore from 'cozy-ui/transpiled/react/LoadMore'
import ListSkeleton from 'cozy-ui/transpiled/react/Skeletons/ListSkeleton'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const style = {
  divider: {
    height: '12px',
    backgroundColor: 'var(--defaultBackgroundColor)'
  }
}

const getQuery = ({ isAllAccountsSelected, accountLogin }) => {
  if (isAllAccountsSelected) {
    return buildAggregatedTimeseriesQuery({ limit: 50 })
  }
  return buildAggregatedTimeseriesQueryByAccountLogin({
    accountLogin,
    limit: 50
  })
}

export const Trips = () => {
  const { accountLogin, isAccountLoading, isAllAccountsSelected } =
    useAccountContext()
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()

  const timeseriesQuery = getQuery({
    isAllAccountsSelected,
    accountLogin
  })
  const { data: timeseries, ...timeseriesQueryLeft } = useQuery(
    timeseriesQuery.definition,
    {
      ...timeseriesQuery.options,
      enabled: Boolean(accountLogin) || isAllAccountsSelected
    }
  )
  if (isAccountLoading) {
    return <ListSkeleton count={8} hasSecondary divider />
  }

  if (
    (accountLogin || isAllAccountsSelected) &&
    isQueryLoading(timeseriesQueryLeft) &&
    !hasQueryBeenLoaded(timeseriesQueryLeft)
  ) {
    return <ListSkeleton count={8} hasSecondary divider />
  }

  if (
    (!isAllAccountsSelected && !accountLogin) ||
    !timeseries ||
    timeseries?.length === 0
  ) {
    return <EmptyContentManager />
  }

  const accountLabel = isAllAccountsSelected
    ? t('trips.allTrips')
    : `${t('trips.from')} ${accountLogin}`

  return (
    <>
      <Titlebar label={accountLabel} />
      {flag('coachco2.bikegoal.enabled') && <BikeGoalManager />}
      <CO2EmissionsChart />
      <CO2EmissionDaccManager />
      {isMobile && <Divider style={style.divider} />}
      <TripsList timeseries={timeseries} />
      {timeseriesQueryLeft.hasMore && (
        <LoadMore
          label={t('loadMore')}
          fetchMore={timeseriesQueryLeft.fetchMore}
        />
      )}
    </>
  )
}

export default Trips
