import React from 'react'

import { isQueryLoading, useQuery } from 'cozy-client'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import { buildGeoJSONQuery } from 'src/queries/queries'
import LoadedModesList from 'src/components/Analysis/Modes/LoadedModesList'

const ModesList = () => {
  const geoJsonQuery = buildGeoJSONQuery()
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

  return <LoadedModesList timeseries={timeseries} />
}

export default ModesList
