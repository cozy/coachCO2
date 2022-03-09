import React, { useMemo } from 'react'

import { hasQueryBeenLoaded, isQueryLoading, useQuery } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import LoadMore from 'cozy-ui/transpiled/react/LoadMore'

import {
  buildAccountQuery,
  buildTimeseriesQueryByAccountId
} from 'src/queries/queries'
import TripsList from 'src/components/TripsList'
import { transformTimeseriesToTrips } from 'src/lib/timeseries'
import Titlebar from 'src/components/Titlebar'

export const Trips = () => {
  const { t } = useI18n()

  const accountQuery = buildAccountQuery()
  const { data: accountQueryRes, ...accountQueryLeft } = useQuery(
    accountQuery.definition,
    accountQuery.options
  )

  const isLoadingAccountQuery =
    isQueryLoading(accountQueryLeft) && !hasQueryBeenLoaded(accountQueryLeft)

  const accounts = useMemo(() => {
    if (Array.isArray(accountQueryRes)) {
      return accountQueryRes.map(account => ({
        label: account.auth.login,
        _id: account._id
      }))
    }
    return []
  }, [accountQueryRes])

  const timeseriesQuery = buildTimeseriesQueryByAccountId(accounts?.[0]?._id)
  const { data: timeseriesQueryResult, ...timeseriesQueryLeft } = useQuery(
    timeseriesQuery.definition,
    {
      ...timeseriesQuery.options,
      enabled: accounts && accounts.length > 0
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

  if (!isLoadingAccountQuery && accounts.length === 0) {
    return <p>{t('account.notFound')}</p>
  }

  return isLoadingAccountQuery || isLoadingTimeseriesQuery ? (
    <Spinner size="xxlarge" className="u-flex u-flex-justify-center u-mt-1" />
  ) : (
    <>
      <Titlebar label={t('trips.from') + ' ' + accounts?.[0]?.label} />
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
