import { buildAccountQueryByLogin } from 'src/queries/queries'

import { isFlagshipApp } from 'cozy-device-helper'
import flag from 'cozy-flags'

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

export const isGeolocationTrackingPossible =
  isFlagshipApp() && flag('coachco2.GPSMemory.enabled')
