import React from 'react'

import { isQueryLoading, useQuery } from 'cozy-client'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import { buildGeoJSONQueryByDateNoLimit } from 'src/queries/queries'
import { useSelectDatesContext } from 'src/components/Providers/SelectDatesProvider'
import LoadedPurposesList from 'src/components/Analysis/Purposes/LoadedPurposesList'

const PurposesList = () => {
  const { selectedDate } = useSelectDatesContext()

  const geoJsonQuery = buildGeoJSONQueryByDateNoLimit(selectedDate)
  const { data: timeseries, ...queryResult } = useQuery(
    geoJsonQuery.definition,
    geoJsonQuery.options
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
