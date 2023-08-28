import React from 'react'
import LoadedModesList from 'src/components/Analysis/Modes/LoadedModesList'
import { useAccountContext } from 'src/components/Providers/AccountProvider'
import { useSelectDatesContext } from 'src/components/Providers/SelectDatesProvider'
import { buildTimeseriesQueryByDateAndAccountId } from 'src/queries/queries'

import { isQueryLoading, useQueryAll } from 'cozy-client'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

const ModesList = () => {
  const { account } = useAccountContext()
  const { selectedDate } = useSelectDatesContext()

  const timeserieQuery = buildTimeseriesQueryByDateAndAccountId(
    selectedDate,
    account?._id
  )
  const { data: timeseries, ...queryResult } = useQueryAll(
    timeserieQuery.definition,
    timeserieQuery.options
  )

  const isLoading = isQueryLoading(queryResult) || queryResult.hasMore

  if (isLoading) {
    return (
      <Spinner size="xxlarge" className="u-flex u-flex-justify-center u-mt-1" />
    )
  }

  return <LoadedModesList timeseries={timeseries} />
}

export default ModesList
