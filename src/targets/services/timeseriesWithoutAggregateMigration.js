import CozyClient from 'cozy-client'
import log from 'cozy-logger'
import schema, { JOBS_DOCTYPE } from 'src/doctypes'
import { APP_SLUG } from 'src/constants'
import { computeAggregatedTimeseries } from 'src/lib/timeseries'
import {
  buildTimeseriesWithoutAggregationByAccountAndDate,
  buildAccountQuery
} from 'src/queries/queries'

import fetch from 'node-fetch'
global.fetch = fetch

const BATCH_DOCS_LIMIT = 1000 // to avoid processing too many files and get timeouts
const SERVICE_NAME = 'timeseriesWithoutAggregateMigration'

const migrateTimeSeriesWithoutAggregation = async () => {
  log('info', `Start migrateTimeSeriesWithoutAggregation service`)
  const client = CozyClient.fromEnv(process.env, { schema })

  // Get all existing accounts
  const accounts = await client.queryAll(
    buildAccountQuery({ limit: null, withOnlyLogin: false }).definition
  )
  if (!accounts) {
    log('info', 'No account found: Nothing to do')
    return
  }
  let moreDocsToProcess = false
  for (const account of accounts) {
    // Query timeseries without aggregation from the last saved date for this account
    const updatedAt = account.data?.lastMigratedTimeserieUpdatedAt || null

    log(
      'info',
      `Query timeseries updated since: ${updatedAt} for account ${account._id}`
    )
    const query = buildTimeseriesWithoutAggregationByAccountAndDate({
      accountId: account._id,
      date: updatedAt,
      limit: BATCH_DOCS_LIMIT
    }).definition
    const resp = await client.query(query)

    if (!resp.data || resp.data.length < 1) {
      log('info', 'Nothing to migrate')
      continue
    }
    log('info', `Found ${resp.data.length} timeseries to migrate...`)

    // Compute aggregation for all retrieved timeseries
    const migratedTimeseries = computeAggregatedTimeseries(resp.data)

    // Save the migrated timeseries
    await client.saveAll(migratedTimeseries)

    // Save in account the startDate of the last processed timeserie
    const moreRecentUpdatedAt =
      migratedTimeseries[migratedTimeseries.length - 1].cozyMetadata.updatedAt

    const newAccountDoc = {
      ...account,
      data: {
        ...account.data,
        lastMigratedTimeserieUpdatedAt: moreRecentUpdatedAt
      }
    }
    await client.save(newAccountDoc)

    log(
      'info',
      `${migratedTimeseries.length} timeseries migrated until ${moreRecentUpdatedAt}`
    )
    if (migratedTimeseries.length >= BATCH_DOCS_LIMIT) {
      moreDocsToProcess = true
    }
  }

  // Restart the service, if necessary
  if (moreDocsToProcess) {
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
