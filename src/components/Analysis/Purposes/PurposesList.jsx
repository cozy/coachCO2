import React from 'react'
import LoadedPurposesList from 'src/components/Analysis/Purposes/LoadedPurposesList'
import EmptyContentManager from 'src/components/EmptyContent/EmptyContentManager'
import { useAccountContext } from 'src/components/Providers/AccountProvider'
import { useSelectDatesContext } from 'src/components/Providers/SelectDatesProvider'
import { buildTimeseriesQueryByDateAndAccountId } from 'src/queries/queries'

import { isQueryLoading, useQueryAll } from 'cozy-client'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

const PurposesList = () => {
  const { account, isAccountLoading } = useAccountContext()
  const { selectedDate, isSelectedDateLoading } = useSelectDatesContext()

  const timeserieQuery = buildTimeseriesQueryByDateAndAccountId(
    selectedDate,
    account?._id
  )
  const { data: timeseries, ...timeseriesQueryLeft } = useQueryAll(
    timeserieQuery.definition,
    timeserieQuery.options
  )

  const isTimeseriesQueryEnabled = timeserieQuery.options.enabled
  const isLoadingTimeseriesQuery =
    isTimeseriesQueryEnabled &&
    (isQueryLoading(timeseriesQueryLeft) || timeseriesQueryLeft.hasMore)

  const isLoading =
    isLoadingTimeseriesQuery || isAccountLoading || isSelectedDateLoading

  const showEmptyContent = !account || !timeseries || timeseries?.length === 0

  if (isLoading) {
    return (
      <Spinner size="xxlarge" className="u-flex u-flex-justify-center u-mt-1" />
    )
  }

  if (showEmptyContent) {
    return <EmptyContentManager />
  }

  return <LoadedPurposesList timeseries={timeseries} />
}

export default PurposesList
