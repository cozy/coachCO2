import difference from 'lodash/difference'
import { CCO2_SETTINGS_DOCTYPE, JOBS_DOCTYPE } from 'src/doctypes'
import { buildAggregateCaptureDeviceTimeseriesQuery } from 'src/queries/nodeQueries'
import { buildSettingsQuery } from 'src/queries/queries'

import logger from 'cozy-logger'

const logService = logger.namespace('services/computeAggregateService')

/**
 * @param {import('cozy-client/types/CozyClient').default} client - The cozy client
 */
export const runComputeAggregateService = async client => {
  const { data: settings } = await client.query(buildSettingsQuery().definition)
  if (!settings || settings?.length < 1) {
    logService('error', 'App settings not found')
    return false
  }
  const settingsCaptureDevices = settings[0].accountsLogins || []

  const timeseries = await client.queryAll(
    buildAggregateCaptureDeviceTimeseriesQuery().definition
  )
  const timeseriesCaptureDevices = [
    ...new Set(timeseries.map(ts => ts.captureDevice))
  ]

  const isAlreadyUpToDate =
    settingsCaptureDevices.length === timeseriesCaptureDevices.length &&
    difference(settingsCaptureDevices, timeseriesCaptureDevices).length === 0

  if (isAlreadyUpToDate) {
    logService('info', 'accountsLogins in app settings already up to date')
    return false
  }

  await client.save({
    ...settings[0],
    _type: CCO2_SETTINGS_DOCTYPE,
    accountsLogins: timeseriesCaptureDevices
  })

  logService('info', 'accountsLogins in app settings updated successfully')
}

/**
 * @param {import('cozy-client/types/CozyClient').default} client
 */
export const launchComputeAggregateJob = async client => {
  try {
    logService('info', 'Start launchComputeAggregateJob')
    const settings = await client.queryAll(buildSettingsQuery().definition)
    const setting = settings?.[0] || {}

    if (setting?.accountsLogins) {
      logService(
        'info',
        'Stop launchComputeAggregateJob because accountsLogins already exists in app settings'
      )
      return
    }

    logService(
      'info',
      "Create job service with slug: 'coachco2' & name: 'computeAggregate'"
    )
    const jobColl = client.collection(JOBS_DOCTYPE)
    await jobColl.create(
      'service',
      { slug: 'coachco2', name: 'computeAggregate' },
      {},
      true
    )
  } catch (error) {
    logService('error', `launchComputeAggregateJob error: ${error}`)
  }
}
