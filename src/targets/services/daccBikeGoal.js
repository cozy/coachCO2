import fetch from 'node-fetch'
import schema from 'src/doctypes'
import { runBikeGoalDACCService } from 'src/lib/dacc'

import CozyClient from 'cozy-client'
import log from 'cozy-logger'

global.fetch = fetch

const dacc = async () => {
  log('info', 'Start dacc service')
  const client = CozyClient.fromEnv(process.env, { schema })
  await runBikeGoalDACCService(client)
}

dacc().catch(e => {
  log('critical', e)
  process.exit(1)
})
