import log from 'cozy-logger'
import flag from 'cozy-flags'
import { models } from 'cozy-client'
import addMonths from 'date-fns/addMonths'
import subMonths from 'date-fns/subMonths'
import startOfMonth from 'date-fns/startOfMonth'
import isThisMonth from 'date-fns/isThisMonth'
import format from 'date-fns/format'
import {
  buildAccountQuery,
  buildTimeseriesQueryByDateAndAccountId,
  buildOldestTimeseriesQueryByAccountId
} from 'src/queries/queries'
import { computeCO2Timeseries } from 'src/lib/timeseries'
import {
  APP_SLUG,
  DACC_MEASURE_NAME_CO2_MONTHLY,
  DACC_MEASURE_GROUP1_CO2_MONTHLY,
  TIMESERIE_MIGRATION_SERVICE_NAME,
  MAX_DACC_MEASURES_SENT
} from 'src/constants'
import { DACC_REMOTE_DOCTYPE, DACC_REMOTE_DOCTYPE_DEV } from 'src/doctypes'
import { restartService } from 'src/lib/services'

const { sendMeasureToDACC, fetchAggregatesFromDACC } = models.dacc

export const sendCO2MeasureToDACC = async (client, measure) => {
  try {
    await flag.initialize(client)
    const remoteDoctype =
      flag('coachco2.dacc-dev_v2') === true
        ? DACC_REMOTE_DOCTYPE_DEV
        : DACC_REMOTE_DOCTYPE
    log('info', `Send measure to ${remoteDoctype} on ${measure.startDate}`)

    await sendMeasureToDACC(client, remoteDoctype, measure)
  } catch (error) {
    log(
      'error',
      `Error while sending measure to remote doctype: ${error.message}`
    )
    throw error
  }
}

/**
 * @typedef {object} DACCAggregate
 *
 * See https://github.com/cozy/cozy-client/blob/0724ceb0905923fc2b2f2e7f322498042813a3b8/packages/cozy-client/src/types.js#L340
 *
 */
/**
 * Fetch monthly DACC CO2 aggregates
 *
 * @param {object} client - The cozy-client instance
 * @returns {Array<DACCAggregate>} The aggregates sorted by startDate.
 */
export const fetchMonthlyAverageCO2FromDACCFor12Month = async client => {
  try {
    const remoteDoctype =
      flag('coachco2.dacc-dev_v2') === true
        ? DACC_REMOTE_DOCTYPE_DEV
        : DACC_REMOTE_DOCTYPE
    const startDate = format(
      startOfMonth(subMonths(Date.now(), 12)),
      'yyyy-MM-dd'
    )
    const results = await fetchAggregatesFromDACC(client, remoteDoctype, {
      measureName: DACC_MEASURE_NAME_CO2_MONTHLY,
      startDate
    })
    return results
  } catch (error) {
    log(
      'error',
      `Error while retrieving data from remote-doctype: ${error.message}`
    )
  }
}

const createMeasureForDACC = (startDate, value) => {
  return {
    createdBy: APP_SLUG,
    measureName: DACC_MEASURE_NAME_CO2_MONTHLY,
    startDate: format(startDate, 'yyyy-MM-dd'),
    value,
    group1: DACC_MEASURE_GROUP1_CO2_MONTHLY
  }
}

const fetchTimeseriesForMonth = async (client, accountId, startDate) => {
  const query = buildTimeseriesQueryByDateAndAccountId(startDate, accountId, {
    withOnlyAggregation: true,
    limit: 1000
  }).definition
  return client.queryAll(query)
}

export const hasNonAggregatedTimeseries = timeseries => {
  const timeseriesWithAggregation = timeseries.filter(
    timeserie => timeserie.aggregation
  )
  return timeseriesWithAggregation.length < timeseries.length
}

const getNextMonthStartDate = date => {
  return startOfMonth(addMonths(date, 1))
}

export const getNextMeasureStartDate = date => {
  const nextMonthStartDate = getNextMonthStartDate(date)
  if (
    nextMonthStartDate.getTime() > Date.now() ||
    isThisMonth(nextMonthStartDate)
  ) {
    return null
  }
  return nextMonthStartDate
}

export const getStartDate = async (client, account) => {
  const accountDate = account.data?.lastDACCMeasureStartDate
  const lastDACCMeasureStartDate = accountDate ? new Date(accountDate) : null
  if (lastDACCMeasureStartDate) {
    return new Date(lastDACCMeasureStartDate)
  }

  const query = buildOldestTimeseriesQueryByAccountId(account._id).definition
  const oldestDoc = await client.query(query)
  if (!oldestDoc.data || oldestDoc.data.length < 1) {
    return null
  }
  const startDate = new Date(oldestDoc.data[0].startDate)

  return startOfMonth(subMonths(startDate, 1))
}

const saveStartDateInAccount = async (client, account, date) => {
  const newAccount = {
    ...account,
    data: {
      ...account.data,
      lastDACCMeasureStartDate: date
    }
  }
  await client.save(newAccount)
}

export const sendMeasuresForAccount = async (client, account) => {
  let nMeasuresSent = 0
  let startDate = await getStartDate(client, account)
  if (!startDate) {
    log('info', `No data to process for account ${account._id}.`)
    return nMeasuresSent
  }
  let nextStartDate = getNextMeasureStartDate(startDate)
  while (nextStartDate && nMeasuresSent < MAX_DACC_MEASURES_SENT) {
    startDate = nextStartDate
    const timeseries = await fetchTimeseriesForMonth(
      client,
      account._id,
      nextStartDate
    )
    if (timeseries.length < 1) {
      // No trips to process for this month
      log('info', `No trips for ${startDate.toISOString()}`)
      nextStartDate = getNextMeasureStartDate(startDate)
      continue
    }
    if (hasNonAggregatedTimeseries(timeseries)) {
      // There are timeseries without aggregation: interrupt service execution to run migration service
      log(
        'warning',
        `Timeseries for ${startDate.toISOString} does not have aggregation`
      )
      await restartService(client, TIMESERIE_MIGRATION_SERVICE_NAME)
      return nMeasuresSent
    }
    const CO2 = computeCO2Timeseries(timeseries)
    const measure = createMeasureForDACC(startDate, CO2)

    await sendCO2MeasureToDACC(client, measure)
    nMeasuresSent++
    nextStartDate = getNextMeasureStartDate(startDate)
  }
  await saveStartDateInAccount(client, account, startDate)
  log('info', `Saved  ${startDate.toISOString()} in account`)

  return nMeasuresSent
}

export const runDACCService = async client => {
  const accounts = await client.queryAll(
    buildAccountQuery({ limit: 1000, withOnlyLogin: false }).definition
  )
  if (!accounts) {
    log('info', 'No account found: Nothing to do')
    return
  }

  let shouldRestartService = false

  for (const account of accounts) {
    const nMeasuresSent = await sendMeasuresForAccount(client, account)
    if (nMeasuresSent >= MAX_DACC_MEASURES_SENT) {
      shouldRestartService = true
    }
    log(
      'info',
      `${nMeasuresSent} measures sent to DACC for account ${account._id}`
    )
  }
  return shouldRestartService
}
