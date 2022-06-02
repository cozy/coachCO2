import CozyClient from 'cozy-client'
import log from 'cozy-logger'
import schema, { JOBS_DOCTYPE } from 'src/doctypes'
import { APP_SLUG } from 'src/constants'

import { runDACCService } from 'src/lib/dacc'

import fetch from 'node-fetch'
global.fetch = fetch

const SERVICE_NAME = 'dacc'

const dacc = async () => {
  log('info', 'Start dacc service')
  const client = CozyClient.fromEnv(process.env, { schema })

  const shouldRestart = await runDACCService(client)
  if (shouldRestart) {
    log('info', 'There are more DACC measures to send: restart the service')
    await client.collection(JOBS_DOCTYPE).create('service', {
      name: SERVICE_NAME,
      slug: APP_SLUG
    })
  }
}

dacc().catch(e => {
  log('critical', e)
  process.exit(1)
})
