import CozyClient from 'cozy-client'
import log from 'cozy-logger'
import schema from 'src/doctypes'

import { runDACCService } from 'src/lib/dacc'
import { restartService } from 'src/lib/services'
import { DACC_SERVICE_NAME } from 'src/constants'

import fetch from 'node-fetch'
global.fetch = fetch

const dacc = async () => {
  log('info', 'Start dacc service')
  const client = CozyClient.fromEnv(process.env, { schema })

  const shouldRestart = await runDACCService(client)
  if (shouldRestart) {
    log('info', 'There are more DACC measures to send: restart the service')
    await restartService(client, DACC_SERVICE_NAME)
  }
}

dacc().catch(e => {
  log('critical', e)
  process.exit(1)
})
