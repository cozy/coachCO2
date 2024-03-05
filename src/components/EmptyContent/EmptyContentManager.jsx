import React from 'react'
import ChangeAccount from 'src/components/EmptyContent/ChangeAccount'
import GPSStandby from 'src/components/EmptyContent/GPSStandby'
import InstallApp from 'src/components/EmptyContent/InstallApp'
import Welcome from 'src/components/EmptyContent/Welcome'
import { makeQueriesByCaptureDevices } from 'src/components/EmptyContent/helpers'
import { useAccountContext } from 'src/components/Providers/AccountProvider'
import { useGeolocationTracking } from 'src/components/Providers/GeolocationTrackingProvider'

import { useQueries, isQueriesLoading } from 'cozy-client'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

const EmptyContentManager = () => {
  const { accountsLogins, accountLogin, isAllAccountsSelected } =
    useAccountContext()
  const { isGeolocationTrackingAvailable, isGeolocationTrackingEnabled } =
    useGeolocationTracking()

  const isGeolocationTrackingLoading =
    isGeolocationTrackingAvailable === null ||
    isGeolocationTrackingEnabled === null

  const otherCaptureDevices = isAllAccountsSelected
    ? []
    : accountsLogins.filter(login => login !== accountLogin)
  const queriesByCaptureDevices =
    makeQueriesByCaptureDevices(otherCaptureDevices)
  const results = useQueries(queriesByCaptureDevices)
  const isLoading = isQueriesLoading(results)

  if (isLoading || isGeolocationTrackingLoading) {
    return (
      <Spinner size="xxlarge" className="u-flex u-flex-justify-center u-mt-1" />
    )
  }

  const hasOtherAccountTimeseries = Object.values(results).some(
    result => result.data.length > 0
  )

  if (hasOtherAccountTimeseries) {
    return <ChangeAccount />
  }

  if (!isGeolocationTrackingAvailable) {
    return <InstallApp />
  }

  if (
    !isGeolocationTrackingEnabled ||
    (!accountLogin && !isAllAccountsSelected)
  ) {
    return <Welcome />
  }

  return <GPSStandby />
}

export default EmptyContentManager
