import fetch from 'node-fetch'
import { DACC_MONTHLY_CO2_SERVICE_NAME } from 'src/constants'
import schema from 'src/doctypes'
import { runMonthlyCO2DACCService } from 'src/lib/dacc'
import { startService } from 'src/lib/services'

import CozyClient from 'cozy-client'
import logger from 'cozy-logger'

const logService = logger.namespace('services/daccMonthlyCO2')

global.fetch = fetch

const dacc = async () => {
  logService('info', 'Start dacc service')
  const client = CozyClient.fromEnv(process.env, { schema })

  const shouldRestart = await runMonthlyCO2DACCService(client)
  if (shouldRestart) {
    logService(
      'info',
      'There are more DACC measures to send: restart the service'
    )
    await startService(client, DACC_MONTHLY_CO2_SERVICE_NAME)
  }
}

dacc().catch(e => {
  logService('error', e)
  process.exit(1)
})
