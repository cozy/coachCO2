import fetch from 'node-fetch'
import schema from 'src/doctypes'
import { fetchTrips } from 'src/lib/openpath/openpath'
import { queryLastServiceAccount } from 'src/lib/openpath/queries'

import CozyClient from 'cozy-client'
import logger from 'cozy-logger'

const logService = logger.namespace('services/fetchOpenPathTrips')
global.fetch = fetch

/**
  Fetch trips from an openpath server
  It is a port of https://github.com/konnectors/openpath
 */
const fetchOpenPathTrips = async () => {
  logService('info', 'Start fetchOpenPathTrips service')

  const client = CozyClient.fromEnv(process.env, { schema })

  const account = await queryLastServiceAccount(client)
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
