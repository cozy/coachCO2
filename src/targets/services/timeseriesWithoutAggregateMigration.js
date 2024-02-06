import fetch from 'node-fetch'
import schema from 'src/doctypes'
import { GEOJSON_DOCTYPE } from 'src/doctypes'
import { initPolyglot } from 'src/lib/services'
import { computeAggregatedTimeseries } from 'src/lib/timeseries'
import { getSectionsFromTrip } from 'src/lib/trips'
import { buildTimeseriesWithoutAggregation } from 'src/queries/nodeQueries'
import { buildSettingsQuery } from 'src/queries/queries'

import CozyClient from 'cozy-client'
import logger from 'cozy-logger'

const logService = logger.namespace(
  'services/timeseriesWithoutAggregateMigration'
)

global.fetch = fetch

const BATCH_DOCS_LIMIT = 1000 // to avoid processing too many files and get timeouts

const { t } = initPolyglot()

const migrateTimeSeriesWithoutAggregation = async () => {
  logService('info', 'Start migrateTimeSeriesWithoutAggregation service')
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
  const resp = await client.queryAll(timeseriesWithoutAggregationQueryDef)
  const data = client.hydrateDocuments(GEOJSON_DOCTYPE, resp)

  if (!data || data.length < 1) {
    logService('info', 'Nothing to migrate')
    return
  }

  logService('info', `Found ${data.length} timeseries to migrate...`)

  const makeSections = timeserie => {
    const serie = timeserie.series[0]
    return getSectionsFromTrip(serie, appSetting)
  }

  // Compute aggregation for all retrieved timeseries
  const migratedTimeseries = computeAggregatedTimeseries({
    timeseries: data,
    makeSections,
    t
  })

  // Save the migrated timeseries
  for (const timeserie of migratedTimeseries) {
    await client.save(timeserie)
  }

  // This service should eventually disappear, so let's add a warning when
  // it was actually useful
  logService(
    'warn',
    `${migratedTimeseries.length} timeseries migrated with aggregation`
  )
}

migrateTimeSeriesWithoutAggregation().catch(e => {
  logService('error', e)
  process.exit(1)
})
