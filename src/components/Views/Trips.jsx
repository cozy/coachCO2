import React from 'react'
import CO2EmissionsChart from 'src/components/CO2EmissionsChart/CO2EmissionsChart'
import CO2EmissionDaccManager from 'src/components/DaccManager/CO2EmissionDaccManager'
import EmptyContentManager from 'src/components/EmptyContent/EmptyContentManager'
import BikeGoalManager from 'src/components/Goals/BikeGoal/BikeGoalManager'
import {
  useAccountContext,
  getAccountLabel
} from 'src/components/Providers/AccountProvider'
import Titlebar from 'src/components/Titlebar'
import TripsList from 'src/components/TripsList'
import { buildAggregatedTimeseriesQueryByAccountId } from 'src/queries/queries'

import { hasQueryBeenLoaded, isQueryLoading, useQuery } from 'cozy-client'
import flag from 'cozy-flags'
import Divider from 'cozy-ui/transpiled/react/Divider'
import LoadMore from 'cozy-ui/transpiled/react/LoadMore'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const style = {
  divider: {
    height: '12px',
    backgroundColor: 'var(--defaultBackgroundColor)'
  }
}

export const Trips = () => {
  const { account, isAccountLoading } = useAccountContext()
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()

  const timeseriesQuery = buildAggregatedTimeseriesQueryByAccountId({
    accountId: account?._id,
    limitBy: 50
  })
  const { data: timeseries, ...timeseriesQueryLeft } = useQuery(
    timeseriesQuery.definition,
    {
      ...timeseriesQuery.options,
      enabled: Boolean(account)
    }
  )
  if (isAccountLoading) {
    return (
      <Spinner size="xxlarge" className="u-flex u-flex-justify-center u-mt-1" />
    )
  }

  if (
    account &&
    isQueryLoading(timeseriesQueryLeft) &&
    !hasQueryBeenLoaded(timeseriesQueryLeft)
  ) {
    return (
      <Spinner size="xxlarge" className="u-flex u-flex-justify-center u-mt-1" />
    )
  }

  if (!account || !timeseries || timeseries?.length === 0) {
    return <EmptyContentManager />
  }
  return (
    <>
      <Titlebar label={t('trips.from') + ' ' + getAccountLabel(account)} />
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
