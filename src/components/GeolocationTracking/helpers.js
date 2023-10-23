import {
  buildAccountQueryByLogin,
  buildOpenPathKonnectorQuery
} from 'src/queries/queries'

import ConnectionFlow from 'cozy-harvest-lib/dist/models/ConnectionFlow'
import { getRandomUUID } from 'cozy-ui/transpiled/react/helpers/getRandomUUID'

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
