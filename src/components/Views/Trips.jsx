import React, { useMemo } from 'react'

import { hasQueryBeenLoaded, isQueryLoading, useQuery } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import LoadMore from 'cozy-ui/transpiled/react/LoadMore'

import { buildTimeseriesQueryByAccountId } from 'src/queries/queries'
import TripsList from 'src/components/TripsList'
import { transformTimeseriesToTrips } from 'src/lib/timeseries'
import Titlebar from 'src/components/Titlebar'
import {
  useAccountContext,
  getAccountLabel
} from 'src/components/Providers/AccountProvider'

export const Trips = () => {
  const { accounts, account } = useAccountContext()
  const { t } = useI18n()

  const timeseriesQuery = buildTimeseriesQueryByAccountId({
    accountId: account?._id,
    limit: 50
  })
  const { data: timeseriesQueryResult, ...timeseriesQueryLeft } = useQuery(
    timeseriesQuery.definition,
    {
      ...timeseriesQuery.options,
      enabled: Boolean(account)
    }
  )

  const isLoadingTimeseriesQuery =
    isQueryLoading(timeseriesQueryLeft) &&
    !hasQueryBeenLoaded(timeseriesQueryLeft)

  const trips = useMemo(() => {
    if (Array.isArray(timeseriesQueryResult)) {
      return transformTimeseriesToTrips(timeseriesQueryResult)
    }
    return []
  }, [timeseriesQueryResult])

  if (isLoadingTimeseriesQuery) {
    return (
      <Spinner size="xxlarge" className="u-flex u-flex-justify-center u-mt-1" />
    )
  }

  if (!accounts || accounts.length === 0) {
    return <p>{t('account.notFound')}</p>
  }

  return (
    <>
      <Titlebar label={t('trips.from') + ' ' + getAccountLabel(account)} />
      <TripsList trips={trips} timeseries={timeseriesQueryResult} />
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
