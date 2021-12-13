import React, { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { isQueryLoading, useQuery } from 'cozy-client'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import TripLayout from 'src/components/Trip/TripLayout'
import { buildGeojsonQuery } from 'src/queries/queries'
import { transformTimeSeriesToTrips } from 'src/lib/trips'

const TripView = () => {
  const { pathname } = useLocation()
  const geojsonId = useMemo(() => pathname.split('/').pop(), [pathname])

  const geoJsonQuery = buildGeojsonQuery(geojsonId)
  const { data, ...tripQueryResult } = useQuery(
    geoJsonQuery.definition,
    geoJsonQuery.options
  )

  const trip = useMemo(() => {
    if (!data || !data.length) {
      return null
    } else {
      return transformTimeSeriesToTrips(data)[0]
    }
  }, [data])

  const isLoading = isQueryLoading(tripQueryResult)

  if (isLoading) {
    return <Spinner size="xxlarge" className="u-flex u-flex-justify-center" />
  }

  return <TripLayout trip={trip} />
}

export default React.memo(TripView)
