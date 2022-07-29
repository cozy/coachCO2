import CozyClient from 'cozy-client'
import log from 'cozy-logger'
import schema from 'src/doctypes'

import { runRecurringPurposes } from 'src/lib/recurringPurposes'

import fetch from 'node-fetch'
global.fetch = fetch

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
  if (!docId || !oldPurpose) {
    log('error', 'No docId or purpose provided to the service')
    return
  }

  await runRecurringPurposes(client, { docId, oldPurpose })
}

recurringPurposes().catch(e => {
  log('critical', e)
  process.exit(1)
})
