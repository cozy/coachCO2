import React from 'react'
import { useNavigate } from 'react-router-dom'

import { hasQueryBeenLoaded, isQueryLoading, useQuery } from 'cozy-client'
import flag from 'cozy-flags'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import LoadMore from 'cozy-ui/transpiled/react/LoadMore'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'

import { buildAggregatedTimeseriesQueryByAccountId } from 'src/queries/queries'
import TripsList from 'src/components/TripsList'
import Titlebar from 'src/components/Titlebar'
import {
  useAccountContext,
  getAccountLabel
} from 'src/components/Providers/AccountProvider'
import SpinnerOrEmptyContent from 'src/components/SpinnerOrEmptyContent'
import CO2EmissionsChart from 'src/components/CO2EmissionsChart/CO2EmissionsChart'
import CO2EmissionDaccManager from 'src/components/DaccManager/CO2EmissionDaccManager'
import BikeGoalManager from 'src/components/Goals/BikeGoal/BikeGoalManager'

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
  const navigate = useNavigate()

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

  return (
    <>
      <Titlebar label={t('trips.from') + ' ' + getAccountLabel(account)} />
      {/* TODO: debug button to be removed */}
      {flag('debug') && (
        <button
          className="u-p-1"
          onClick={() => {
            const currentYear = new Date().getFullYear().toString()
            navigate(`/bikegoal/${currentYear}/trips`)
          }}
        >
          go to bikeGoal
        </button>
      )}
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
