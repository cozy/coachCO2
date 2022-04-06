import React, { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { isQueryLoading, useQuery } from 'cozy-client'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import TripDialogMobile from 'src/components/Trip/TripDialogMobile'
import { buildTimeserieQueryById } from 'src/queries/queries'
import { transformTimeseriesToTrips } from 'src/lib/timeseries'
import TripProvider from 'src/components/Providers/TripProvider'

const Trip = () => {
  const { pathname } = useLocation()
  const timeserieId = useMemo(() => pathname.split('/').pop(), [pathname])

  const timeserieQuery = buildTimeserieQueryById(timeserieId)
  const { data, ...tripQueryResult } = useQuery(
    timeserieQuery.definition,
    timeserieQuery.options
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
    <TripProvider timeserie={data[0]} trip={trip}>
      <TripDialogMobile />
    </TripProvider>
  )
}

export default React.memo(Trip)
