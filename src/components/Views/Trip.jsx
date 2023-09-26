import React, { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import SuccessSnackbar from 'src/components/ContactToPlace/SuccessSnackbar'
import TripProvider from 'src/components/Providers/TripProvider'
import TripDialogDesktop from 'src/components/Trip/TripDialogDesktop'
import TripDialogMobile from 'src/components/Trip/TripDialogMobile'
import { buildTimeserieQueryById } from 'src/queries/queries'

import { isQueryLoading, useQuery } from 'cozy-client'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

const Trip = () => {
  const [ContactToPlaceSuccessMessage, setContactToPlaceSuccessMessage] =
    useState('')
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
      {isMobile ? (
        <TripDialogMobile onSuccessMessage={setContactToPlaceSuccessMessage} />
      ) : (
        <TripDialogDesktop onSuccessMessage={setContactToPlaceSuccessMessage} />
      )}
      <SuccessSnackbar
        message={ContactToPlaceSuccessMessage}
        onClose={() => setContactToPlaceSuccessMessage('')}
      />
    </TripProvider>
  )
}

export default React.memo(Trip)
