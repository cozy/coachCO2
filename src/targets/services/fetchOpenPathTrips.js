import fetch from 'node-fetch'
import schema from 'src/doctypes'
import { fetchTrips } from 'src/lib/openpath/openpath'
import {
  queryAccountByToken,
  queryLastServiceAccount
} from 'src/lib/openpath/queries'

import CozyClient from 'cozy-client'
import logger from 'cozy-logger'

const logService = logger.namespace('services/fetchOpenPathTrips')
global.fetch = fetch

/**
  Fetch trips from an openpath server
  It is a port of https://github.com/konnectors/openpath
  This service can be called either by periodic trigger or directly by webhook 
 */
const fetchOpenPathTrips = async () => {
  logService('info', 'Start fetchOpenPathTrips service')

  // Get payload sent when service is called from webhook
  const { newTrips = null, user = null } = JSON.parse(
    process.env['COZY_PAYLOAD'] || '{}'
  )

  if (newTrips === 0) {
    logService(
      'info',
      'Fetch trips service called from webhook with no new trips'
    )
    return
  } else if (newTrips > 0) {
    logService('info', `${newTrips} new trips to retrieve`)
  }

  const client = CozyClient.fromEnv(process.env, { schema })

  let account
  if (user) {
    // Find account from given user token
    account = await queryAccountByToken(client, user)
  } else {
    // Find account from creation date
    account = await queryLastServiceAccount(client)
  }

  if (!account) {
    logService('info', 'No account found. Abort.')
    return
  }
  // This is required to set the sourceAccount, which is used to filter
  // trips by account
  const appMetadata = {
    sourceAccount: account._id,
    slug: 'coachco2'
  }
  client.setAppMetadata(appMetadata)

  await fetchTrips(client, account)
}

fetchOpenPathTrips().catch(e => {
  logService('error', e)
  process.exit(1)
})
