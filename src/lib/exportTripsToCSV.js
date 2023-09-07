import format from 'date-fns/format'
import sortBy from 'lodash/sortBy'
import { COLUMNS_NAMES_CSV } from 'src/constants'
import {
  getStartPlaceDisplayName,
  getEndPlaceDisplayName,
  getManualPurpose,
  getSectionsFromTrip,
  getTripStartDate,
  getTripEndDate
} from 'src/lib/trips'
import { buildSettingsQuery } from 'src/queries/queries'

import { models } from 'cozy-client'
import log from 'cozy-logger'

import { getOrCreateAppFolderWithReference } from './getOrCreateAppFolderWithReference'
import { transformTimeseriesToTrips } from './timeseries'

const {
  file: { uploadFileWithConflictStrategy }
} = models

export const makeCSVFilename = (accountLabel, t) => {
  const today = format(new Date(), 'yyyy MM dd')

  return t('export.filename', { today, accountLabel })
}

/**
 * @param {object} tripsData
 * @returns {string}
 */
export const convertTripsToCSV = tripsData => {
  const tripsDataWithHeader = [Object.keys(tripsData[0]), ...tripsData]

  return tripsDataWithHeader
    .map(trip =>
      Object.values(trip)
        .map(tripValue => (tripValue ? `"${tripValue}"` : ' '))
        .toString()
    )
    .join('\n')
}

/**
 * @param {import('cozy-client/types/CozyClient').default} client
 * @param {object} trips
 * @returns {object}
 */
export const makeTripsForExport = async (client, trips) => {
  const settingsQuery = buildSettingsQuery()
  const { data: settings } = await client.query(
    settingsQuery.definition,
    settingsQuery.options
  )
  const appSetting = settings?.[0] || {}

  const result = trips.flatMap(trip => {
    const sectionsInfo = getSectionsFromTrip(trip, appSetting)

    return sectionsInfo.map(sectionInfo => {
      const sectionData = {
        [COLUMNS_NAMES_CSV.sectionStartDate]: sectionInfo.startDate,
        [COLUMNS_NAMES_CSV.sectionEndDate]: sectionInfo.endDate,
        [COLUMNS_NAMES_CSV.sectionDuration]: sectionInfo.duration,
        [COLUMNS_NAMES_CSV.sectionDistance]: sectionInfo.distance,
        [COLUMNS_NAMES_CSV.sectionMode]: sectionInfo.mode,
        [COLUMNS_NAMES_CSV.sectionCoordinates]: sectionInfo.coordinates,
        [COLUMNS_NAMES_CSV.sectionDistances]: sectionInfo.distances,
        [COLUMNS_NAMES_CSV.sectionTimestamps]: sectionInfo.timestamps,
        [COLUMNS_NAMES_CSV.sectionSpeeds]: sectionInfo.speeds
      }
      const tripData = {
        [COLUMNS_NAMES_CSV.tripId]: trip.id,
        [COLUMNS_NAMES_CSV.tripStartDate]: getTripStartDate(trip),
        [COLUMNS_NAMES_CSV.tripEndDate]: getTripEndDate(trip),
        [COLUMNS_NAMES_CSV.tripStartDisplayName]:
          getStartPlaceDisplayName(trip),
        [COLUMNS_NAMES_CSV.tripArrivalDisplayName]:
          getEndPlaceDisplayName(trip),
        [COLUMNS_NAMES_CSV.tripPurpose]: getManualPurpose(trip)
      }

      return { ...tripData, ...sectionData }
    })
  })

  return sortBy(result, COLUMNS_NAMES_CSV.tripId)
}

/**
 * Get or create CoachCO2 folder into Drive and upload CSV file inside
 *
 * @param {object} param
 * @param {CozyClient} param.client - Instance of Cozy-Client
 * @param {Function} param.t - I18n function
 * @param {object} param.timeseries -
 * @param {string} param.accountName - Name of account
 * @returns {Promise<{ appDir: object | null, fileCreated: object | null, isLoading: boolean }>}
 */
export const uploadFile = async ({ client, t, timeseries, accountName }) => {
  try {
    const trips = transformTimeseriesToTrips(timeseries)
    const tripsData = await makeTripsForExport(client, trips)
    const tripsCSV = convertTripsToCSV(tripsData)
    const CSVFilename = makeCSVFilename(accountName, t)
    const folder = await getOrCreateAppFolderWithReference(client, t)
    const { data } = await uploadFileWithConflictStrategy(client, tripsCSV, {
      name: CSVFilename,
      contentType: 'text/csv',
      dirId: folder._id,
      conflictStrategy: 'rename'
    })

    return { appDir: folder, fileCreated: data, isLoading: false }
  } catch (error) {
    log('error', error)
    return { appDir: null, fileCreated: null, isLoading: true }
  }
}
