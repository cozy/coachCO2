import sortBy from 'lodash/sortBy'
import format from 'date-fns/format'

import { models } from 'cozy-client'

const {
  file: { uploadFileWithConflictStrategy }
} = models

import {
  getStartPlaceDisplayName,
  getEndPlaceDisplayName,
  getPurpose,
  getSectionsFromTrip,
  getTripStartDate,
  getTripEndDate
} from 'src/lib/trips'
import { COLUMNS_NAMES_CSV } from 'src/constants'
import { transformTimeseriesToTrips } from 'src/lib/timeseries'
import { getOrCreateAppFolderWithReference } from 'src/lib/getOrCreateAppFolderWithReference'
import { buildTimeseriesQueryNoLimit } from 'src/queries/queries'

const makeCSVFilename = (accountLabel, t) => {
  const today = format(new Date(), 'YYYY MM DD')

  return t('export.filename', { today, accountLabel })
}

/**
 * @param {object} tripsData
 * @returns {string}
 */
const convertTripsToCSV = tripsData => {
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
 * @param {object} trips
 * @returns {object}
 */
const makeTripsForExport = trips => {
  const result = trips.flatMap(trip => {
    const sectionsInfo = getSectionsFromTrip(trip)

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
        [COLUMNS_NAMES_CSV.tripStartDisplayName]: getStartPlaceDisplayName(
          trip
        ),
        [COLUMNS_NAMES_CSV.tripArrivalDisplayName]: getEndPlaceDisplayName(
          trip
        ),
        [COLUMNS_NAMES_CSV.tripPurpose]: getPurpose(trip)
      }

      return { ...tripData, ...sectionData }
    })
  })

  return sortBy(result, COLUMNS_NAMES_CSV.tripId)
}

/**
 * @param {object} trips
 * @returns {{ appFolder: object, file: object }}
 */
export const exportTripsToCSV = async (client, t, accountName) => {
  const timeseriesDef = buildTimeseriesQueryNoLimit()
  const { data } = await client.query(timeseriesDef.definition)

  const trips = transformTimeseriesToTrips(data)
  const tripsData = makeTripsForExport(trips)

  if (tripsData.length > 0) {
    const tripsCSV = convertTripsToCSV(tripsData)
    const CSVFilename = makeCSVFilename(accountName, t)
    const appFolder = await getOrCreateAppFolderWithReference(client, t)

    const { data: fileCreated } = await uploadFileWithConflictStrategy(
      client,
      tripsCSV,
      {
        name: CSVFilename,
        contentType: 'text/csv',
        dirId: appFolder._id,
        conflictStrategy: 'rename'
      }
    )

    return { appFolder, file: fileCreated }
  }
}
