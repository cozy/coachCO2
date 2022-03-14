import React from 'react'

import { isQueryLoading } from 'cozy-client'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import { buildTimeseriesQueryByDateAndAccountId } from 'src/queries/queries'
import { useSelectDatesContext } from 'src/components/Providers/SelectDatesProvider'
import { useAccountContext } from 'src/components/Providers/AccountProvider'
import LoadedPurposesList from 'src/components/Analysis/Purposes/LoadedPurposesList'
import useFullyLoadedQuery from 'src/hooks/useFullyLoadedQuery'

const PurposesList = () => {
  const { account } = useAccountContext()
  const { selectedDate } = useSelectDatesContext()

  const timeserieQuery = buildTimeseriesQueryByDateAndAccountId(
    selectedDate,
    account?._id
  )
  const { data: timeseries, ...queryResult } = useFullyLoadedQuery(
    timeserieQuery.definition,
    timeserieQuery.options
  )

  const isLoading = isQueryLoading(queryResult)

  if (isLoading) {
    return (
      <Spinner size="xxlarge" className="u-flex u-flex-justify-center u-mt-1" />
    )
  }

  return <LoadedPurposesList timeseries={timeseries} />
}

export default PurposesList
