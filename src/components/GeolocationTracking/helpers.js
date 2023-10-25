import {
  buildAccountQueryByLogin,
  buildOpenPathKonnectorQuery
} from 'src/queries/queries'

import { isFlagshipApp } from 'cozy-device-helper'
import flag from 'cozy-flags'
import ConnectionFlow from 'cozy-harvest-lib/dist/models/ConnectionFlow'
import { getRandomUUID } from 'cozy-ui/transpiled/react/helpers/getRandomUUID'

const FEATURE_NAME = 'geolocationTracking'

export const createOpenPathAccount = async ({
  client,
  t,
  lang,
  deviceName
}) => {
  const openPathKonnectorQuery = buildOpenPathKonnectorQuery()
  const {
    data: { attributes: konnector }
  } = await client.query(
    openPathKonnectorQuery.definition,
    openPathKonnectorQuery.options
  )

  const flow = new ConnectionFlow(client, null, konnector)

  const newLogin = await getOpenPathAccountName({
    client,
    t,
    lang,
    deviceName
  })
  const newPassword = getRandomUUID()

  await flow.createAccountSilently({
    konnector,
    vaultClient: null,
    cipherId: null,
    trigger: null,
    account: null,
    userCredentials: {
      login: newLogin,
      password: newPassword,
      providerId: '1' // Cozy Provider
    }
  })

  return {
    login: newLogin,
    password: newPassword
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
  setIsGeolocationTrackingEnabled
) => {
  const { enabled } = await webviewIntent.call('getGeolocationTrackingStatus')
  setIsGeolocationTrackingEnabled(enabled)
}

export const disableGeolocationTracking = async (
  webviewIntent,
  setIsGeolocationTrackingEnabled
) => {
  await webviewIntent.call('setGeolocationTracking', false)
  await syncTrackingStatusWithFlagship(
    webviewIntent,
    setIsGeolocationTrackingEnabled
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
  const geolocationTrackingId = await webviewIntent.call(
    'getGeolocationTrackingId'
  )

  if (geolocationTrackingId === null) {
    const { deviceName } = await webviewIntent.call('getDeviceInfo')

    const { password } = await createOpenPathAccount({
      client,
      t,
      lang,
      deviceName
    })

    await webviewIntent.call('setGeolocationTrackingId', password)
  }

  // enable geolocation tracking
  await webviewIntent.call('setGeolocationTracking', true)
  await syncTrackingStatusWithFlagship(
    webviewIntent,
    setIsGeolocationTrackingEnabled
  )
}

export const checkPermissionsAndEnableTrackingOrShowDialog = async ({
  client,
  lang,
  t,
  setIsGeolocationTrackingEnabled,
  permissions,
  webviewIntent,
  setShowLocationRequestableDialog,
  setShowLocationRefusedDialog
}) => {
  const checkedPermissions =
    permissions ||
    (await webviewIntent.call('checkPermissions', 'geolocationTracking'))

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
}

export const isGeolocationTrackingPossible =
  isFlagshipApp() && flag('coachco2.GPSMemory.enabled')

export const checkAndSetGeolocationTrackingAvailability = async (
  webviewIntent,
  setIsGeolocationTrackingAvailable
) => {
  if (isGeolocationTrackingPossible) {
    try {
      const isAvailable = await webviewIntent.call('isAvailable', FEATURE_NAME)

      setIsGeolocationTrackingAvailable(isAvailable)
    } catch {
      /* if isAvailable is not implemented it will throw an error */
    }
  }
}
