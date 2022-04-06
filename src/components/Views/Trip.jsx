import React, { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { isQueryLoading, useQuery } from 'cozy-client'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import TripDialogMobile from 'src/components/Trip/TripDialogMobile'
import { buildTimeserieQueryById } from 'src/queries/queries'
import TripProvider from 'src/components/Providers/TripProvider'

const Trip = () => {
  const { pathname } = useLocation()
  const timeserieId = useMemo(() => pathname.split('/').pop(), [pathname])

  const timeserieQuery = buildTimeserieQueryById(timeserieId)
  const { data, ...tripQueryResult } = useQuery(
    timeserieQuery.definition,
    timeserieQuery.options
  )

  const isLoading = isQueryLoading(tripQueryResult)

  if (isLoading) {
    return (
      <Spinner size="xxlarge" className="u-flex u-flex-justify-center u-mt-1" />
    )
  }

  return (
    <TripProvider timeserie={data[0]}>
      <TripDialogMobile />
    </TripProvider>
  )
}

export default React.memo(Trip)
