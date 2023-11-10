import fetch from 'node-fetch'
import { DACC_MONTHLY_CO2_SERVICE_NAME } from 'src/constants'
import schema from 'src/doctypes'
import { runMonthlyCO2DACCService } from 'src/lib/dacc'
import { startService } from 'src/lib/services'

import CozyClient from 'cozy-client'
import log from 'cozy-logger'

global.fetch = fetch

const dacc = async () => {
  log('info', 'Start dacc service')
  const client = CozyClient.fromEnv(process.env, { schema })

  const shouldRestart = await runMonthlyCO2DACCService(client)
  if (shouldRestart) {
    log('info', 'There are more DACC measures to send: restart the service')
    await startService(client, DACC_MONTHLY_CO2_SERVICE_NAME)
  }
}

dacc().catch(e => {
  log('critical', e)
  process.exit(1)
})
