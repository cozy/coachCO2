import React from 'react'

import { isQueryLoading, useQuery } from 'cozy-client'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import { buildTimeseriesQueryByDateAndAccountIdNoLimit } from 'src/queries/queries'
import { useSelectDatesContext } from 'src/components/Providers/SelectDatesProvider'
import { useAccountContext } from 'src/components/Providers/AccountProvider'
import LoadedPurposesList from 'src/components/Analysis/Purposes/LoadedPurposesList'

const PurposesList = () => {
  const { account } = useAccountContext()
  const { selectedDate } = useSelectDatesContext()

  const timeserieQuery = buildTimeseriesQueryByDateAndAccountIdNoLimit(
    selectedDate,
    account?._id
  )
  const { data: timeseries, ...queryResult } = useQuery(
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
