import fetch from 'node-fetch'
import schema from 'src/doctypes'
import {
  runRecurringPurposesForManualTrip,
  runRecurringPurposesForNewTrips
} from 'src/lib/recurringPurposes'
import { initPolyglot } from 'src/lib/services'

import CozyClient from 'cozy-client'
import log from 'cozy-logger'

global.fetch = fetch

const { t } = initPolyglot()

/**
 * This service detects recurring trips and set automatic purpose.
 * It is triggered when the user edits a manual purpose.
 *
 */
const recurringPurposes = async () => {
  log('info', 'Start recurringPurposes service')
  const client = CozyClient.fromEnv(process.env, { schema })

  const fields = JSON.parse(process.env.COZY_FIELDS || '{}')
  const { docId, oldPurpose } = fields
  if (docId && oldPurpose) {
    log('info', 'Search for recurring trips after manual edit')
    await runRecurringPurposesForManualTrip(client, { docId, oldPurpose }, t)
  } else {
    log('info', 'Search for new recurring trips')
    await runRecurringPurposesForNewTrips(client, t)
  }
}

recurringPurposes().catch(e => {
  log('critical', e)
  process.exit(1)
})
