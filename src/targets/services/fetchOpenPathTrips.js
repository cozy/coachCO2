import fetch from 'node-fetch'
import schema from 'src/doctypes'
import { checkAndSendGeolocationQuotaNotification } from 'src/lib/geolocationQuota/lib'
import {
  fetchTrips,
  getStartingDate,
  purgeOpenPath
} from 'src/lib/openpath/openpath'
import {
  queryAccountByToken,
  queryServiceAccounts
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

  let accounts
  if (user) {
    // Find account from given user token
    const account = await queryAccountByToken(client, user)
    if (account) {
      accounts = [account]
    }
  } else {
    // Find all service accounts
    accounts = await queryServiceAccounts(client)
  }

  if (!accounts || accounts.length < 1) {
    logService('info', 'No account found. Abort.')
    return
  }

  let totalSavedTrips = 0
  for (const account of accounts) {
    // This is required to set the sourceAccount, which is used to filter
    // trips by account
    const appMetadata = {
      sourceAccount: account._id,
      slug: 'coachco2'
    }
    client.setAppMetadata(appMetadata)

    const startDate = await getStartingDate(account)
    if (!startDate) {
      logService('info', `No trip saved yet for account ${account._id}. Abort.`)
      continue
    }
    const savedTripsCount = await fetchTrips(client, account, startDate)
    logService(
      'info',
      `Saved ${savedTripsCount} trips for account ${account._id}`
    )
    if (savedTripsCount > 0) {
      // When all the trips have been fetched and saved, openpath server can be
      // told to cleanup the data.
      // The given date corresponds to the previous trip start date
      await purgeOpenPath(account, startDate)
      totalSavedTrips += savedTripsCount
    }
  }
  if (totalSavedTrips > 0) {
    await checkAndSendGeolocationQuotaNotification(client, logService)
  }
}

fetchOpenPathTrips().catch(e => {
  logService('error', e)
  process.exit(1)
})
