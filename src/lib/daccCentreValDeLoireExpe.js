import endOfMonth from 'date-fns/endOfMonth'
import startOfMonth from 'date-fns/startOfMonth'
import {
  DACC_EXPE_CONSENT_MEASURE,
  DACC_MEASURE_NAME_SECTIONS_CO2,
  DACC_MEASURE_NAME_SECTIONS_COUNT,
  DACC_MEASURE_NAME_SECTIONS_DISTANCE,
  DACC_MEASURE_NAME_SECTIONS_DURATION,
  DACC_MEASURE_NAME_TRIPS_CO2,
  DACC_MEASURE_NAME_TRIPS_COUNT,
  DACC_MEASURE_NAME_TRIPS_DISTANCE,
  DACC_MEASURE_NAME_TRIPS_DURATION
} from 'src/constants'
import { CONTACTS_DOCTYPE } from 'src/doctypes'
import {
  buildSettingsQuery,
  buildTimeseriesByDateRange
} from 'src/queries/queries'

import logger from 'cozy-logger'

import {
  createMeasureForDACC,
  sendMeasureToDACCWithRemoteDoctype
} from './dacc'

/**
 * @typedef {import("cozy-client/dist/index").CozyClient} CozyClient
 * @typedef {import("cozy-client/types/types").IoCozyAccount} IoCozyAccount
 * @typedef {import('./types').ContactGroup} ContactGroup
 * @typedef {import('./types').TimeseriesGeoJSON} TimeseriesGeoJSON
 * @typedef {import('./types').Section} Section
 * @typedef {import('./types').DACCMeasure} DACCMeasure
 */

/**
 * @typedef {Object} MeasuresDict
 * @property {{ count: number }}
 * @property {{ CO2: number }}
 * @property {{ distance: number }}
 * @property {{ duration: number }}
 *
 */

export const GROUP_ID = '0c91da19b72444d01cbd93b49b2ba18c'

const logService = logger.namespace('services/centreValDeLoireExpe')

/**
 * Send bike goal measures
 *
 * @param {CozyClient} client - The cozy-client instance
 * @param {IoCozyAccount} account - The trips account to measure
 */
export const sendCentreValDeLoireMeasuresToDACC = async (client, account) => {
  const startAggDate = startOfMonth(new Date())
  logService('info', `Compute DACC measures for account ${account._id}`)

  const userType = await findUserType(client)

  const consentMeasure = buildConsentMeasure(userType)
  await sendMeasureToDACCWithRemoteDoctype(client, consentMeasure)

  const timeseries = await findMonthTimeseries(client, account, startAggDate)
  if (timeseries.length < 1) {
    logService('info', `No trips to compute`)
    // No trips, abort
    return null
  }
  logService('info', `Compute measures for ${timeseries.length} timeseries`)
  const measures = computeRawMeasures(timeseries)
  if (!measures || (!measures.sectionMeasures && !measures.tripMeasures)) {
    logService('info', 'No measure to send')
    return
  }
  const daccMeasures = []
  if (measures.tripMeasures && Object.keys(measures.tripMeasures).length > 0) {
    logService(
      'info',
      `Build ${
        Object.keys(measures.tripMeasures).length
      } measures with user type:  ${userType}`
    )
    const daccTripMeasures = await buildDACCMeasures({
      measures: measures.tripMeasures,
      userType,
      isSectionLevel: false
    })
    daccMeasures.push(...daccTripMeasures)
  }
  if (
    measures.sectionMeasures &&
    Object.keys(measures.sectionMeasures).length > 0
  ) {
    logService(
      'info',
      `Build ${
        Object.keys(measures.sectionMeasures).length
      } measures with user type:  ${userType}`
    )
    logSanityChecksErrors(measures.sectionMeasures)

    const daccSectionMeasures = await buildDACCMeasures({
      measures: measures.sectionMeasures,
      userType,
      isSectionLevel: true
    })
    daccMeasures.push(...daccSectionMeasures)
  }

  for (const measure of daccMeasures) {
    logService('info', `Send measure ${JSON.stringify(measure)} to DACC...`)
    await sendMeasureToDACCWithRemoteDoctype(client, measure)
  }
}

/**
 * Find user type, as defined in settings
 *
 * @param {CozyClient} client - The cozy-client instance
 * @returns {string} the user type: 'highSchoolStudent' | 'nationalEducationStaff' | 'centreValDeLoireStaff' | 'other'
 */
const findUserType = async client => {
  const settingsQueryDef = buildSettingsQuery()
  const resp = await client.query(
    settingsQueryDef.definition,
    settingsQueryDef.options
  )
  if (!resp) {
    return 'unknown'
  }
  const settings = resp.data?.[0]
  const userType = settings?.centreValDeLoireExpe?.userType
  return userType || 'unknown'
}

/**
 * Find the timeseries for the current month
 *
 * @param {CozyClient} client - The cozy-client instance
 * @param {IoCozyAccount} account - The trips account
 * @param {Date} startDate - The month starting date
 * @returns {Array<TimeSeries>} the month timeseries
 */
const findMonthTimeseries = async (client, account, startDate) => {
  const endDate = endOfMonth(startDate)
  logService(
    'info',
    `Query timeseries from ${startDate.toISOString()} to ${endDate.toISOString()}`
  )
  const queryDef = buildTimeseriesByDateRange({
    firstDate: startDate.toISOString(),
    lastDate: endDate.toISOString(),
    accountId: account._id,
    withRelationships: true,
    limit: 1000
  })
  const timeseries = await client.queryAll(
    queryDef.definition,
    queryDef.options
  )
  // FIXME: hydration seems not working? Both startPlaceContact and endPlaceContact
  // appear in document after hydratation as HasOne, but with no content, even though the documents
  // are in the store, and appear in the .include response of client.query
  for (const ts of timeseries) {
    const startPlaceId = ts.relationships?.startPlaceContact?.data?._id
    const endPlaceId = ts.relationships?.endPlaceContact?.data?._id
    if (startPlaceId) {
      const startPlaceContact = client.getDocumentFromState(
        CONTACTS_DOCTYPE,
        startPlaceId
      )
      ts.startPlaceContact = startPlaceContact
    }
    if (endPlaceId) {
      const endPlaceContact = client.getDocumentFromState(
        CONTACTS_DOCTYPE,
        endPlaceId
      )
      ts.endPlaceContact = endPlaceContact
    }
  }

  return timeseries
}

/**
 * Get the main transporation mode from the sections, i.e.
 * the mode with the longest distance.
 *
 * @param {Array<Section>} sections - The sections to extract the main mode
 * @returns {string} the main mode
 */
export const getMainModeFromSections = sections => {
  if (!sections) {
    return 'unknown'
  }
  let modeDistances = sections.reduce((acc, section) => {
    if (acc[section.mode]) {
      acc[section.mode] += section.distance
    } else {
      acc[section.mode] = section.distance
    }
    return acc
  }, {})

  let mainMode = null
  let maxDistance = 0
  for (let mode in modeDistances) {
    if (modeDistances[mode] > maxDistance) {
      mainMode = mode
      maxDistance = modeDistances[mode]
    }
  }
  return mainMode
}

/**
 * Compute raw measures from timeseries documents.
 * It returns measures with this dict format:
 * ```
 * sections: '<mode>/<school>/<schoolTripDirection>/<isMainMode>': {count, CO2, duration, distance}
 * trips: '<modes>/<school>/<schoolTripDirection>/<mainMode>': {count, CO2, duration, distance}
 * ```
 * @param {Array<TimeseriesGeoJSON>} - The timeseries to compute
 * @returns {{MeasuresDict, MeasuresDict}} two set of measures grouped by key
 */
export const computeRawMeasures = timeseries => {
  if (!timeseries || timeseries.length < 1) {
    return null
  }
  const sectionMeasures = {}
  const tripMeasures = {}

  for (const ts of timeseries) {
    if (!ts.aggregation) {
      continue
    }

    // If the trip starts or ends with a registered highschool, use its name as group
    const startPlace = ts.startPlaceContact
    const endPlace = ts.endPlaceContact

    const hasExpeStartPlace =
      startPlace &&
      startPlace.relationships?.groups?.data.some(data => data._id === GROUP_ID)
    const hasExpeEndPlace =
      endPlace &&
      endPlace.relationships?.groups?.data.some(data => data._id === GROUP_ID)

    let school = ''
    let schoolTripDirection = 'none'
    if (hasExpeStartPlace && hasExpeEndPlace) {
      school = startPlace.displayName
      schoolTripDirection = 'round'
    } else if (hasExpeStartPlace) {
      school = startPlace.displayName
      schoolTripDirection = 'return'
    } else if (hasExpeEndPlace) {
      school = endPlace.displayName
      schoolTripDirection = 'outward'
    }
    const mainMode = getMainModeFromSections(ts.aggregation.sections)
    // Compute section measures
    if (ts.aggregation.sections) {
      for (const section of ts.aggregation.sections) {
        const isMainMode = section.mode === mainMode ? 1 : 0
        const keyMeasure = `${section.mode}/${school}/${schoolTripDirection}/${isMainMode}`
        const measure = sectionMeasures[keyMeasure]
        if (!measure) {
          sectionMeasures[keyMeasure] = {
            count: 1,
            sumCO2: section.CO2,
            sumDuration: section.duration,
            sumDistance: section.distance
          }
        } else {
          const newCount = measure.count + 1
          const newCO2 = measure.sumCO2 + section.CO2
          const newDuration = measure.sumDuration + section.duration
          const newDistance = measure.sumDistance + section.distance
          sectionMeasures[keyMeasure] = {
            count: newCount,
            sumCO2: newCO2,
            sumDuration: newDuration,
            sumDistance: newDistance
          }
        }
      }
    }

    // Compute trip measure
    const uniqueSortedModes = Array.from(new Set(ts.aggregation.modes)).sort()
    const joinModes = uniqueSortedModes.join(':')
    const keyTripMeasure = `${joinModes}/${school}/${schoolTripDirection}/${mainMode}`
    const measure = tripMeasures[keyTripMeasure]
    if (!measure) {
      tripMeasures[keyTripMeasure] = {
        count: 1,
        sumCO2: ts.aggregation.totalCO2,
        sumDuration: ts.aggregation.totalDuration,
        sumDistance: ts.aggregation.totalDistance
      }
    } else {
      const newCount = measure.count + 1
      const newCO2 = measure.sumCO2 + ts.aggregation.totalCO2
      const newDuration = measure.sumDuration + ts.aggregation.totalDuration
      const newDistance = measure.sumDistance + ts.aggregation.totalDistance
      tripMeasures[keyTripMeasure] = {
        count: newCount,
        sumCO2: newCO2,
        sumDuration: newDuration,
        sumDistance: newDistance
      }
    }
  }
  return { sectionMeasures, tripMeasures }
}

/**
 * Log errors if there are sanity checks errors
 *
 * @param {MeasuresDict} measures - The measures to check
 */
const logSanityChecksErrors = measures => {
  const errors = sanityChecks(measures)
  for (const err of errors) {
    logService('error', err)
  }
}

/**
 * Perform sanity checks on measures
 * @param {MeasuresDict} measures - The measures to check
 *
 * @returns {Array<string>} the errors message
 */
export const sanityChecks = measures => {
  const sanityErrors = []
  for (const key of Object.keys(measures)) {
    const measure = measures[key]

    for (const agg in measure) {
      if (measure[agg] < 0) {
        const msg = `Error: Negative value found: ${agg}: ${measure[agg]}`
        sanityErrors.push(msg)
      }
    }
  }
  return sanityErrors
}

const buildConsentMeasure = userType => {
  const startDate = new Date()
  const groups = [{ userType }]
  const consentMeasure = createMeasureForDACC({
    measureName: DACC_EXPE_CONSENT_MEASURE,
    startDate,
    value: 1,
    groups
  })
  return consentMeasure
}

const buildMeasureGroups = ({ keyTokens, userType, isSectionLevel }) => {
  if (isSectionLevel) {
    const mode = keyTokens[0]
    const school = keyTokens.length > 1 ? keyTokens[1] : ''
    const schoolTripDirection = keyTokens.length > 2 ? keyTokens[2] : 'none'
    const isMainMode = keyTokens.length > 3 ? keyTokens[3] : '0'
    return [
      { mode },
      { school },
      { userType },
      { schoolTripDirection },
      { isMainMode }
    ]
  } else {
    const modes = keyTokens[0]
    const school = keyTokens.length > 1 ? keyTokens[1] : ''
    const schoolTripDirection = keyTokens.length > 2 ? keyTokens[2] : 'none'
    const mainMode = keyTokens.length > 3 ? keyTokens[3] : ''
    return [
      { modes },
      { school },
      { userType },
      { schoolTripDirection },
      { mainMode }
    ]
  }
}

/**
 * Build actual DACC measures from raw measures dict
 *
 * @typedef BuildMeasuresParams
 * @property {MeasuresDict} measures - The measures to build from
 * @property {string} userType - The user type
 * @property {boolean} isSectionLevel - Whether or not the measure is aggregated on the sections
 *
 * @param {BuildMeasuresParams} - The params
 * @returns {Array<DACCMeasure>} the DACC measures
 */
const buildDACCMeasures = ({ measures, userType, isSectionLevel }) => {
  const daccMeasures = []

  for (const key of Object.keys(measures)) {
    const keyTokens = key.split('/')
    if (keyTokens.length < 1) {
      logService('error', `Wrong measure key: ${key}`)
      continue
    }
    const groups = buildMeasureGroups({ keyTokens, userType, isSectionLevel })

    // Note: normally we would use the aggregation starting date, i.e. the start
    // of the month. But as we are using an incremental process (full month aggregation everyday),
    // it's easier to use the daily date to differenciate measures on the DACC side.
    const startDate = new Date()
    const countMeasure = createMeasureForDACC({
      measureName: isSectionLevel
        ? DACC_MEASURE_NAME_SECTIONS_COUNT
        : DACC_MEASURE_NAME_TRIPS_COUNT,
      startDate,
      value: measures[key].count,
      groups
    })

    const CO2Measure = createMeasureForDACC({
      measureName: isSectionLevel
        ? DACC_MEASURE_NAME_SECTIONS_CO2
        : DACC_MEASURE_NAME_TRIPS_CO2,
      startDate,
      value: measures[key].sumCO2,
      groups
    })

    // Compute final avg duration
    const avgDuration = Number(
      (measures[key].sumDuration / measures[key].count).toFixed(2)
    )

    const durationMeasure = createMeasureForDACC({
      measureName: isSectionLevel
        ? DACC_MEASURE_NAME_SECTIONS_DURATION
        : DACC_MEASURE_NAME_TRIPS_DURATION,
      startDate,
      value: avgDuration,
      groups
    })

    // Compute final avg distance
    const avgDistance = Number(
      (measures[key].sumDistance / measures[key].count).toFixed(2)
    )

    const distanceMeasure = createMeasureForDACC({
      measureName: isSectionLevel
        ? DACC_MEASURE_NAME_SECTIONS_DISTANCE
        : DACC_MEASURE_NAME_TRIPS_DISTANCE,
      startDate,
      value: avgDistance,
      groups
    })
    daccMeasures.push(
      countMeasure,
      CO2Measure,
      durationMeasure,
      distanceMeasure
    )
  }
  return daccMeasures
}
