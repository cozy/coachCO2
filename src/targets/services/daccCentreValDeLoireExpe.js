import fetch from 'node-fetch'
import schema from 'src/doctypes'
import { runCentreValDeLoireExpe } from 'src/lib/dacc'

import CozyClient from 'cozy-client'
import logger from 'cozy-logger'

const logService = logger.namespace('services/daccCentreValDeLoireExpe')

global.fetch = fetch

const dacc = async () => {
  logService('info', 'Start dacc service')
  const client = CozyClient.fromEnv(process.env, { schema })
  await runCentreValDeLoireExpe(client)
}

dacc().catch(e => {
  logService('error', e)
  process.exit(1)
})
