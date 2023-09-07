import fetch from 'node-fetch'
import schema from 'src/doctypes'
import { computeAggregatedTimeseries } from 'src/lib/timeseries'
import {
  buildSettingsQuery,
  buildTimeseriesWithoutAggregation
} from 'src/queries/queries'

import CozyClient from 'cozy-client'
import log from 'cozy-logger'
global.fetch = fetch

const BATCH_DOCS_LIMIT = 1000 // to avoid processing too many files and get timeouts

const migrateTimeSeriesWithoutAggregation = async () => {
  log('info', `Start migrateTimeSeriesWithoutAggregation service`)
  const client = CozyClient.fromEnv(process.env, { schema })

  const timeseriesWithoutAggregationQueryDef =
    buildTimeseriesWithoutAggregation({
      limit: BATCH_DOCS_LIMIT
    }).definition
  const settingsQuery = buildSettingsQuery()

  const { data: settings } = await client.query(
    settingsQuery.definition,
    settingsQuery.options
  )
  const appSetting = settings?.[0] || {}
  const resp = await client.query(timeseriesWithoutAggregationQueryDef)

  if (!resp.data || resp.data.length < 1) {
    log('info', 'Nothing to migrate')
    return
  }
  log('info', `Found ${resp.data.length} timeseries to migrate...`)

  // Compute aggregation for all retrieved timeseries
  const migratedTimeseries = computeAggregatedTimeseries(resp.data, appSetting)

  // Save the migrated timeseries
  for (const timeserie of migratedTimeseries) {
    await client.save(timeserie)
  }

  log(
    'info',
    `${migratedTimeseries.length} timeseries migrated with aggregation`
  )
}

migrateTimeSeriesWithoutAggregation().catch(e => {
  log('critical', e)
  process.exit(1)
})
