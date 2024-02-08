import { OPENPATH_ACCOUNT_TYPE } from 'src/constants'
import { ACCOUNTS_DOCTYPE } from 'src/doctypes'
import {
  buildAccountQueryByLogin,
  buildLastCreatedServiceAccountQuery
} from 'src/queries/queries'

import { isFlagshipApp } from 'cozy-device-helper'
import flag from 'cozy-flags'
import minilog from 'cozy-minilog'
import { getRandomUUID } from 'cozy-ui/transpiled/react/helpers/getRandomUUID'

const FEATURE_NAME = 'geolocationTracking'

const log = minilog('GeolocationTracking')

export const createOpenPathAccount = async ({
  client,
  t,
  lang,
  deviceName
}) => {
  const newLogin = await getOpenPathAccountName({
    client,
    t,
    lang,
    deviceName
  })
  const newToken = getRandomUUID()
  const attributes = {
    account_type: OPENPATH_ACCOUNT_TYPE,
    auth: {
      login: newLogin
    },
    token: newToken
  }
  await client.create(ACCOUNTS_DOCTYPE, attributes)
  return {
    login: newLogin,
    password: newToken
  }
}

export const getOpenPathAccountName = async ({
  client,
  t,
  lang,
  deviceName
}) => {
  const defaultName = deviceName

  const accountQueryByLogin = buildAccountQueryByLogin(deviceName)

  const { data: accountsWithDeviceNameAsLogin } = await client.query(
    accountQueryByLogin.definition,
    accountQueryByLogin.options
  )

  if (accountsWithDeviceNameAsLogin.length === 0) {
    return defaultName
  }

  return `${deviceName} ${t(
    'geolocationTracking.settings.createdOn'
  )} ${new Date().toLocaleDateString(lang)}`
}

export const syncTrackingStatusWithFlagship = async (
  webviewIntent,
  setIsGeolocationTrackingEnabled,
  setIsGeolocationQuotaExceeded
) => {
  const { enabled, quotaExceeded = false } = (await webviewIntent?.call(
    'getGeolocationTrackingStatus'
  )) || {
    enabled: false,
    quotaExceeded: false
  }

  setIsGeolocationTrackingEnabled(enabled)
  setIsGeolocationQuotaExceeded(quotaExceeded)
}

export const disableGeolocationTracking = async (
  webviewIntent,
  setIsGeolocationTrackingEnabled,
  setIsGeolocationQuotaExceeded
) => {
  await webviewIntent?.call('setGeolocationTracking', false)
  await syncTrackingStatusWithFlagship(
    webviewIntent,
    setIsGeolocationTrackingEnabled,
    setIsGeolocationQuotaExceeded
  )
}

export const enableGeolocationTracking = async ({
  client,
  lang,
  t,
  webviewIntent,
  setIsGeolocationTrackingEnabled
}) => {
  // create account if necessary
  const geolocationTrackingId = await webviewIntent?.call(
    'getGeolocationTrackingId'
  )

  if (geolocationTrackingId === null) {
    const { deviceName } = (await webviewIntent?.call('getDeviceInfo')) || {
      deviceName: null
    }

    if (deviceName) {
      let password
      const accountQuery = buildLastCreatedServiceAccountQuery()
      const { data: resp } = await client.query(
        accountQuery.definition,
        accountQuery.options
      )
      const account = resp?.[0]
      if (!account?.token || account?.auth?.login !== deviceName) {
        // Note that both konnector (without token) and service account (with token)
        // could have the same device name. A migration might be needed at some point.
        const account = await createOpenPathAccount({
          client,
          t,
          lang,
          deviceName
        })
        password = account.password
      } else {
        password = account.token
      }

      await webviewIntent?.call('setGeolocationTrackingId', password)
    }
  }

  // enable geolocation tracking
  await webviewIntent?.call('setGeolocationTracking', true)

  /* FIXME START
  There is a bug in cozy-flagship-app. await setGeolocationTracking(true) return BEFORE the tracking is enabled.
  The fix has been done in cozy-flagship-app (bae397dd9060bb6122bfcdd2a1dab4e5cbb53687) but we need to wait for the next release.
  So we fix it now for the moment by always considering it as a success. It should be safe
  because starting tracking should not fail.

  1 week after the commit in cozy-flagship-app is released, we can revert this commit.
  */
  setIsGeolocationTrackingEnabled(true)
  /* FIXME END */
}

export const checkPermissionsAndEnableTrackingOrShowDialog = async ({
  client,
  lang,
  t,
  setIsGeolocationTrackingEnabled,
  permissions,
  webviewIntent,
  setShowLocationRequestableDialog,
  setShowLocationRefusedDialog,
  setShowLocationDisabledDialog
}) => {
  try {
    const checkedPermissions =
      permissions ||
      (await webviewIntent?.call('checkPermissions', 'geolocationTracking')) ||
      {}

    if (checkedPermissions.granted) {
      await enableGeolocationTracking({
        client,
        lang,
        t,
        webviewIntent,
        setIsGeolocationTrackingEnabled
      })
    } else if (checkedPermissions.canRequest) {
      setShowLocationRequestableDialog(true)
    } else {
      setShowLocationRefusedDialog(true)
    }
  } catch (e) {
    if (e.message === 'Native permission unavailable') {
      setShowLocationDisabledDialog(true)
    } else {
      log.error(e)
    }
  }
}

export const isGeolocationTrackingPossible = () =>
  isFlagshipApp() && flag('coachco2.GPSMemory.enabled')

export const checkAndSetGeolocationTrackingAvailability = async (
  webviewIntent,
  setIsGeolocationTrackingAvailable
) => {
  if (isGeolocationTrackingPossible()) {
    try {
      const isAvailable =
        (await webviewIntent?.call('isAvailable', FEATURE_NAME)) || null

      setIsGeolocationTrackingAvailable(isAvailable)
    } catch {
      /* if isAvailable is not implemented it will throw an error */
    }
  } else {
    setIsGeolocationTrackingAvailable(false)
  }
}

export const getNewPermissionAndEnabledTrackingOrShowDialog = async ({
  webviewIntent,
  client,
  lang,
  t,
  setIsGeolocationTrackingEnabled,
  setShowLocationRequestableDialog,
  setShowLocationRefusedDialog,
  setShowLocationDisabledDialog
}) => {
  const permissions = await webviewIntent?.call(
    'requestPermissions',
    'geolocationTracking'
  )
  await checkPermissionsAndEnableTrackingOrShowDialog({
    client,
    lang,
    t,
    setIsGeolocationTrackingEnabled,
    permissions,
    webviewIntent,
    setShowLocationRequestableDialog,
    setShowLocationRefusedDialog,
    setShowLocationDisabledDialog
  })
}
