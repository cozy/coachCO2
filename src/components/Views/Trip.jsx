import React, { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import TripProvider from 'src/components/Providers/TripProvider'
import TripDialogDesktop from 'src/components/Trip/TripDialogDesktop'
import TripDialogMobile from 'src/components/Trip/TripDialogMobile'
import { buildTimeserieQueryById } from 'src/queries/queries'

import { isQueryLoading, useQuery } from 'cozy-client'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

const Trip = () => {
  const { isMobile } = useBreakpoints()
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
    <TripProvider timeserie={data}>
      {isMobile ? <TripDialogMobile /> : <TripDialogDesktop />}
    </TripProvider>
  )
}

export default React.memo(Trip)
