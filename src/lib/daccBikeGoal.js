import { DACC_MEASURE_NAME_BIKE_GOAL } from 'src/constants'
import { buildBikeCommuteTimeseriesQueryByAccountId } from 'src/queries/queries'

import flag from 'cozy-flags'
import log from 'cozy-logger'

import {
  createMeasureForDACC,
  sendMeasureToDACCWithRemoteDoctype
} from './dacc'
import { countUniqDays } from './timeseries'

/**
 * @typedef {import("cozy-client/dist/index").CozyClient} CozyClient
 * @typedef {import("cozy-client/types/types").IoCozyAccount} IoCozyAccount
 */

/**
 * The group name provided by flag
 *
 * @param {CozyClient}} client - The cozy-client instance
 * @returns {string} The group name
 */
export const getBikeGroupName = async client => {
  await flag.initialize(client)
  const sourceName = flag('coachco2.bikegoal.settings')?.sourceName
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

  const bikeGroupName = await getBikeGroupName(client)

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
