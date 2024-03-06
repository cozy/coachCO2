import fetch from 'node-fetch'
import schema from 'src/doctypes'
import { runComputeAggregateService } from 'src/lib/computeAggregateService'

import CozyClient from 'cozy-client'
import logger from 'cozy-logger'

const logService = logger.namespace('services/computeAggregate')

global.fetch = fetch

const computeAggregate = async () => {
  logService('info', 'Start computeAggregate service')
  const client = CozyClient.fromEnv(process.env, { schema })
  await runComputeAggregateService(client)
}

computeAggregate().catch(e => {
  logService('error', e)
  process.exit(1)
})
