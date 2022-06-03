import CozyClient from 'cozy-client'
import log from 'cozy-logger'
import schema from 'src/doctypes'
import { computeAggregatedTimeseries } from 'src/lib/timeseries'
import { buildTimeseriesWithoutAggregation } from 'src/queries/queries'
import { restartService } from 'src/lib/services'
import { TIMESERIE_MIGRATION_SERVICE_NAME } from 'src/constants'
import fetch from 'node-fetch'
global.fetch = fetch

const BATCH_DOCS_LIMIT = 1000 // to avoid processing too many files and get timeouts

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
    await restartService(client, TIMESERIE_MIGRATION_SERVICE_NAME)
  }
}

migrateTimeSeriesWithoutAggregation().catch(e => {
  log('critical', e)
  process.exit(1)
})
