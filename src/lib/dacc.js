import { MAX_DACC_MEASURES_SENT } from 'src/constants'
import { DACC_REMOTE_DOCTYPE, DACC_REMOTE_DOCTYPE_DEV } from 'src/doctypes'
import { buildAccountQuery, buildSettingsQuery } from 'src/queries/queries'

import { models } from 'cozy-client'
import flag from 'cozy-flags'
import log from 'cozy-logger'

import { sendMeasuresForAccount } from './daccMonthlyCO2'

const { sendMeasureToDACC } = models.dacc

export const getDACCRemoteDoctype = () => {
  return flag('coachco2.dacc-dev_v2') === true
    ? DACC_REMOTE_DOCTYPE_DEV
    : DACC_REMOTE_DOCTYPE
}

export const sendMeasureToDACCWithRemoteDoctype = async (client, measure) => {
  try {
    await flag.initialize(client)
    const remoteDoctype = getDACCRemoteDoctype()
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
 * Run the DACC service
 *
 * @param {object} client - The client instance
 * @returns {boolean} Whether or not the service should be restarted
 */
export const runDACCService = async client => {
  const settings = await client.queryAll(buildSettingsQuery().definition)
  if (!settings?.[0]?.CO2Emission?.sendToDACC) {
    log('info', 'The user did not give consent to send data to DACC')
    return false
  }
  const accounts = await client.queryAll(
    buildAccountQuery({ limit: 1000, withOnlyLogin: false }).definition
  )
  if (!accounts) {
    log('info', 'No account found: Nothing to do')
    return false
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
