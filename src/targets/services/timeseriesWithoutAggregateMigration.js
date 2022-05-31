import CozyClient from 'cozy-client'
import log from 'cozy-logger'
import schema, { JOBS_DOCTYPE } from 'src/doctypes'
import { APP_SLUG } from 'src/constants'
import { computeAggregatedTimeseries } from 'src/lib/timeseries'
import { buildTimeseriesWithoutAggregation } from 'src/queries/queries'

import fetch from 'node-fetch'
global.fetch = fetch

const BATCH_DOCS_LIMIT = 1000 // to avoid processing too many files and get timeouts
const SERVICE_NAME = 'timeseriesWithoutAggregateMigration'

const migrateTimeSeriesWithoutAggregation = async () => {
  log('info', `Start migrateTimeSeriesWithoutAggregation service`)
  const client = CozyClient.fromEnv(process.env, { schema })

  const query = buildTimeseriesWithoutAggregation({
    limit: BATCH_DOCS_LIMIT
  }).definition
  const resp = await client.query(query)

  if (!resp.data || resp.data.length < 1) {
    log('info', 'Nothing to migrate')
    return
  }
  log('info', `Found ${resp.data.length} timeseries to migrate...`)

  // Compute aggregation for all retrieved timeseries
  const migratedTimeseries = computeAggregatedTimeseries(resp.data)

  // Save the migrated timeseries
  await client.saveAll(migratedTimeseries)

  log(
    'info',
    `${migratedTimeseries.length} timeseries migrated with aggregation`
  )
  // Restart the service, if necessary
  if (migratedTimeseries.length >= BATCH_DOCS_LIMIT) {
    log('info', 'There are more timeseries to migrate: restart the service')
    await client.collection(JOBS_DOCTYPE).create('service', {
      name: SERVICE_NAME,
      slug: APP_SLUG
    })
  }
}

migrateTimeSeriesWithoutAggregation().catch(e => {
  log('critical', e)
  process.exit(1)
})
