import React, { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { isQueryLoading, useQuery } from 'cozy-client'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import TripDialogMobile from 'src/components/Trip/TripDialogMobile'
import { buildGeoJSONQueryById } from 'src/queries/queries'
import { transformTimeseriesToTrips } from 'src/lib/trips'
import TripProvider from 'src/components/Trip/TripProvider'

const TripView = () => {
  const { pathname } = useLocation()
  const geojsonId = useMemo(() => pathname.split('/').pop(), [pathname])

  const geoJsonQuery = buildGeoJSONQueryById(geojsonId)
  const { data, ...tripQueryResult } = useQuery(
    geoJsonQuery.definition,
    geoJsonQuery.options
  )

  const trip = useMemo(() => {
    if (!data || !data.length) {
      return null
    } else {
      return transformTimeseriesToTrips(data)[0]
    }
  }, [data])

  const isLoading = isQueryLoading(tripQueryResult)

  if (isLoading) {
    return (
      <Spinner size="xxlarge" className="u-flex u-flex-justify-center u-mt-1" />
    )
  }

  return (
    <TripProvider geojson={data[0]} trip={trip}>
      <TripDialogMobile />
    </TripProvider>
  )
}

export default React.memo(TripView)
