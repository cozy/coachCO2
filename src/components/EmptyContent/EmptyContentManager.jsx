import React from 'react'
import ChangeAccount from 'src/components/EmptyContent/ChangeAccount'
import GPSStandby from 'src/components/EmptyContent/GPSStandby'
import InstallApp from 'src/components/EmptyContent/InstallApp'
import Welcome from 'src/components/EmptyContent/Welcome'
import { makeQueriesByAccountsId } from 'src/components/EmptyContent/helpers'
import { useGeolocationTracking } from 'src/components/Providers/GeolocationTrackingProvider'

import { useQueries, isQueriesLoading } from 'cozy-client'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

const EmptyContentManager = ({ account, accounts }) => {
  const { isGeolocationTrackingAvailable, isGeolocationTrackingEnabled } =
    useGeolocationTracking()

  const otherAccounts = accounts.filter(
    allAccount => allAccount._id !== account._id
  )
  const queriesByAccountsId = makeQueriesByAccountsId(otherAccounts)
  const results = useQueries(queriesByAccountsId)
  const isLoading = isQueriesLoading(results)

  if (isLoading) {
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

  if (!isGeolocationTrackingEnabled) {
    return <Welcome />
  }

  return <GPSStandby />
}

export default EmptyContentManager
