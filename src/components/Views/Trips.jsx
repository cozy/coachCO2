import React from 'react'

import {
  hasQueryBeenLoaded,
  isQueryLoading,
  useQuery,
  useClient
} from 'cozy-client'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import LoadMore from 'cozy-ui/transpiled/react/LoadMore'

import { buildTimeseriesQueryByAccountId } from 'src/queries/queries'
import TripsList from 'src/components/TripsList'
import Titlebar from 'src/components/Titlebar'
import {
  useAccountContext,
  getAccountLabel
} from 'src/components/Providers/AccountProvider'
import EmptyContent from 'src/components/EmptyContent'
import CO2EmissionsChart from 'src/components/CO2EmissionsChart/CO2EmissionsChart'
import DaccManager from 'src/components/DaccManager/DaccManager'

export const Trips = () => {
  const { account, isAccountLoading } = useAccountContext()
  const { t } = useI18n()
  const client = useClient()
  const { isMobile } = useBreakpoints()

  const timeseriesQuery = buildTimeseriesQueryByAccountId({
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

  if (isAccountLoading) {
    return (
      <Spinner size="xxlarge" className="u-flex u-flex-justify-center u-mt-1" />
    )
  }

  if (!account) {
    return (
      <>
        {isMobile && <Titlebar label={client.appMetadata.slug} />}
        <EmptyContent />
      </>
    )
  }

  if (isLoadingTimeseriesQuery) {
    return (
      <Spinner size="xxlarge" className="u-flex u-flex-justify-center u-mt-1" />
    )
  }

  if (timeseries.length === 0) {
    return (
      <>
        {isMobile && <Titlebar label={client.appMetadata.slug} />}
        <EmptyContent />
      </>
    )
  }

  return (
    <>
      <Titlebar label={t('trips.from') + ' ' + getAccountLabel(account)} />
      <CO2EmissionsChart />
      <DaccManager />
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
