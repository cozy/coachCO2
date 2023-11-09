import React from 'react'
import LoadedPurposesList from 'src/components/Analysis/Purposes/LoadedPurposesList'
import SpinnerOrEmptyContent from 'src/components/EmptyContent/SpinnerOrEmptyContent'
import { useAccountContext } from 'src/components/Providers/AccountProvider'
import { useSelectDatesContext } from 'src/components/Providers/SelectDatesProvider'
import { buildTimeseriesQueryByDateAndAccountId } from 'src/queries/queries'

import { isQueryLoading, useQueryAll } from 'cozy-client'

const PurposesList = () => {
  const { account, isAccountLoading } = useAccountContext()
  const { selectedDate } = useSelectDatesContext()

  const timeserieQuery = buildTimeseriesQueryByDateAndAccountId(
    selectedDate,
    account?._id
  )
  const { data: timeseries, ...timeseriesQueryLeft } = useQueryAll(
    timeserieQuery.definition,
    timeserieQuery.options
  )

  const isLoadingTimeseriesQuery =
    isQueryLoading(timeseriesQueryLeft) || timeseriesQueryLeft.hasMore

  const isLoadingOrEmpty =
    isAccountLoading ||
    !account ||
    isLoadingTimeseriesQuery ||
    timeseries?.length === 0

  if (isLoadingOrEmpty) {
    return (
      <SpinnerOrEmptyContent isTimeseriesLoading={isLoadingTimeseriesQuery} />
    )
  }

  return <LoadedPurposesList timeseries={timeseries} />
}

export default PurposesList
