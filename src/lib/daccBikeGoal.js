import format from 'date-fns/format'
import subDays from 'date-fns/subDays'
import { getSource } from 'src/components/Goals/BikeGoal/helpers'
import { DACC_MEASURE_NAME_BIKE_GOAL } from 'src/constants'
import {
  createMeasureForDACC,
  getDACCRemoteDoctype,
  sendMeasureToDACCWithRemoteDoctype
} from 'src/lib/dacc'
import { countUniqDays } from 'src/lib/timeseries'
import { buildBikeCommuteTimeseriesQueryByAccountId } from 'src/queries/queries'

import { models } from 'cozy-client'
import flag from 'cozy-flags'
import log from 'cozy-logger'

const { fetchAggregatesFromDACC } = models.dacc

/**
 * @typedef {import("cozy-client/dist/index").CozyClient} CozyClient
 * @typedef {import("cozy-client/types/types").IoCozyAccount} IoCozyAccount
 * @typedef {import('cozy-client/types/types').DACCAggregate} DACCAggregate
 */

/**
 * Fetch bike goal aggregate, for the previous day
 *
 * @param {CozyClient} client - The cozy-client instance
 * @returns {Array<DACCAggregate>} The aggregates sorted by startDate.
 */
export const fetchYesterdayBikeGoalFromDACC = async client => {
  try {
    const remoteDoctype = getDACCRemoteDoctype()
    // Get results from previous day, to ensure there is data
    const currentDate = Date.now()
    const startDate = format(subDays(currentDate, 1), 'yyyy-MM-dd')
    const endDate = format(currentDate, 'yyyy-MM-dd')
    const results = await fetchAggregatesFromDACC(client, remoteDoctype, {
      measureName: DACC_MEASURE_NAME_BIKE_GOAL,
      startDate,
      endDate
    })
    return results
  } catch (error) {
    log(
      'error',
      `Error while retrieving data from remote-doctype: ${error.message}`
    )
  }
}

/**
 * Get average value for the given group name
 *
 * @param {Array<DACCAggregate>} aggregates - The aggregates to extract value
 * @param {string} groupName - The group name from which we want the average value
 * @returns {number} The average value for the group
 */
export const getAvgDaysForGroupName = aggregates => {
  const groupName = getBikeGroupName()
  for (const agg of aggregates) {
    const isCorrectGroup = agg.groups.some(
      group => group.groupName === groupName
    )
    if (isCorrectGroup) {
      return Math.round(agg.avg)
    }
  }
  return null
}

/**
 * The group name provided by flag
 *
 * @param {CozyClient}} client - The cozy-client instance
 * @returns {string} The group name
 */
export const getBikeGroupName = () => {
  const { sourceName } = getSource()
  const groupName = sourceName || 'unknown'
  return groupName
}

/**
 * Send bike goal measures
 *
 * @param {CozyClient}} client - The cozy-client instance
 * @param {IoCozyAccount} account - The trips account to measure
 */
export const sendBikeGoalMeasuresForAccount = async (client, account) => {
  const currentDate = new Date()
  await flag.initialize(client)

  const bikeCommuteQuery = buildBikeCommuteTimeseriesQueryByAccountId(
    { accountId: account._id, date: currentDate },
    true
  ).definition
  log('info', `Query commute trips with: ${JSON.stringify(bikeCommuteQuery)}`)
  const timeseries = await client.queryAll(bikeCommuteQuery)
  log('info', `Number of commute trips on bike: ${timeseries?.length}`)
  if (timeseries?.length < 1) {
    log('info', 'No timeseries found. Abort.')
    return null
  }

  const daysWithBikeCommute = countUniqDays(timeseries)
  log('info', `Number of days with commute bike : ${daysWithBikeCommute}`)

  const bikeGroupName = getBikeGroupName()

  const measure = createMeasureForDACC({
    startDate: currentDate,
    value: daysWithBikeCommute,
    measureName: DACC_MEASURE_NAME_BIKE_GOAL,
    groups: [
      {
        groupName: bikeGroupName
      }
    ]
  })
  log('info', `Send measure ${JSON.stringify(measure)} to DACC...`)
  await sendMeasureToDACCWithRemoteDoctype(client, measure)
}
