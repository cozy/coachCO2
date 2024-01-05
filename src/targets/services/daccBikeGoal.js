import fetch from 'node-fetch'
import schema from 'src/doctypes'
import { runBikeGoalDACCService } from 'src/lib/dacc'

import CozyClient from 'cozy-client'
import logger from 'cozy-logger'

const logService = logger.namespace('services/daccBikeGoal')

global.fetch = fetch

const dacc = async () => {
  logService('info', 'Start dacc service')
  const client = CozyClient.fromEnv(process.env, { schema })
  await runBikeGoalDACCService(client)
}

dacc().catch(e => {
  logService('error', e)
  process.exit(1)
})
