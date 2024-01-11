import format from 'date-fns/format'
import get from 'lodash/get'
import { APP_SLUG, MAX_DACC_MEASURES_SENT } from 'src/constants'
import { DACC_REMOTE_DOCTYPE, DACC_REMOTE_DOCTYPE_DEV } from 'src/doctypes'
import { buildAccountQuery, buildSettingsQuery } from 'src/queries/queries'

import { models } from 'cozy-client'
import flag from 'cozy-flags'
import logger from 'cozy-logger'

import { sendBikeGoalMeasuresForAccount } from './daccBikeGoal'
import { sendCentreValDeLoireMeasuresToDACC } from './daccCentreValDeLoireExpe'
import { sendCO2MeasuresForAccount } from './daccMonthlyCO2'

const logService = logger.namespace('services/dacc')

const { sendMeasureToDACC } = models.dacc

/**
 * @typedef {import("cozy-client/dist/index").CozyClient} CozyClient
 */

export const getDACCRemoteDoctype = () => {
  return flag('coachco2.dacc-dev_v2') === true
    ? DACC_REMOTE_DOCTYPE_DEV
    : DACC_REMOTE_DOCTYPE
}

/**
 * Send measure to DACC with remote-doctype
 *
 * @param {import("cozy-client/dist/index").CozyClient}} client - The cozy-client instance
 * @param {import('./types').DACCMeasure} measure - The DACC measure
 */
export const sendMeasureToDACCWithRemoteDoctype = async (client, measure) => {
  try {
    await flag.initialize(client)
    const remoteDoctype = getDACCRemoteDoctype()
    logService(
      'info',
      `Send measure to ${remoteDoctype} on ${measure.startDate}`
    )

    await sendMeasureToDACC(client, remoteDoctype, measure)
  } catch (error) {
    logService(
      'error',
      'Error while sending measure to remote doctype',
      error.message
    )
    throw error
  }
}

/**
 * @typedef MeasureParams
 * @property {string} measureName - The name of the DACC measure
 * @property {string} startDate - The measure date
 * @property {number} value - The measured value
 * @property {object} group1 - A DACC group, to aggregate measures
 * @property {Array<object>} groups - An array for all groups, to aggregate measures
 *
 * @param {MeasureParams} - The measure params
 * @returns {import('./types').DACCMeasure} - The DACC measure
 */
export const createMeasureForDACC = ({
  measureName,
  startDate,
  value,
  group1,
  groups
}) => {
  const measure = {
    createdBy: APP_SLUG,
    measureName,
    startDate: format(startDate, 'yyyy-MM-dd'),
    value
  }
  if (group1) {
    // Old API
    measure.group1 = group1
  } else if (groups) {
    measure.groups = groups
  }
  return measure
}

const hasConsentFromSettings = async (client, consentKey) => {
  const settings = await client.queryAll(buildSettingsQuery().definition)
  if (!settings || settings?.length < 1) {
    return false
  }
  const consent = get(settings[0], consentKey)
  return consent
}

const getAccounts = async client => {
  const accounts = await client.queryAll(
    buildAccountQuery({ limit: 1000, withOnlyLogin: false }).definition
  )
  return accounts
}

/**
 * Run the monthly COZ2 DACC service
 *
 * @param {import("cozy-client/dist/index").CozyClient}} client - The client instance
 * @returns {boolean} Whether or not the service should be restarted
 */
export const runMonthlyCO2DACCService = async client => {
  const consent = await hasConsentFromSettings(client, 'CO2Emission.sendToDACC')
  if (!consent) {
    logService('info', 'The user did not give consent to send data to DACC')
    return false
  }
  const accounts = await getAccounts(client)
  if (!accounts) {
    logService('info', 'No account found: Nothing to do')
    return false
  }

  let shouldRestartService = false

  for (const account of accounts) {
    const nMeasuresSent = await sendCO2MeasuresForAccount(client, account)
    if (nMeasuresSent >= MAX_DACC_MEASURES_SENT) {
      shouldRestartService = true
    }
    logService(
      'info',
      `${nMeasuresSent} measures sent to DACC for account ${account._id}`
    )
  }

  return shouldRestartService
}

/**
 * Run the bike goal DACC service
 *
 * @param {CozyClient} client - The cozy-client instance
 */
export const runBikeGoalDACCService = async client => {
  const consent = await hasConsentFromSettings(client, 'bikeGoal.sendToDACC')
  if (!consent) {
    logService('info', 'The user did not give consent to send data to DACC')
    return false
  }
  const accounts = await getAccounts(client)
  if (!accounts) {
    logService('info', 'No account found: Nothing to do')
    return false
  }

  for (const account of accounts) {
    await sendBikeGoalMeasuresForAccount(client, account)
  }
}

export const runCentreValDeLoireExpe = async client => {
  const consent = await hasConsentFromSettings(
    client,
    'centreValDeLoireExpe.sendToDACC'
  )
  if (!consent) {
    logService('info', 'The user did not give consent to send data to DACC')
    return false
  }
  const accounts = await getAccounts(client)
  if (!accounts) {
    logService('info', 'No account found: Nothing to do')
    return false
  }

  for (const account of accounts) {
    await sendCentreValDeLoireMeasuresToDACC(client, account)
  }
}
