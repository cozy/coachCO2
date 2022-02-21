import sortBy from 'lodash/sortBy'

import {
  getStartPlaceDisplayName,
  getEndPlaceDisplayName,
  getPurpose,
  getSectionsInfo,
  getStartDate,
  getEndDate
} from 'src/lib/trips'
import { COLUMNS_NAMES_CSV } from 'src/constants/const'

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
export const makeTripsForExport = trips => {
  const result = trips.flatMap(trip => {
    const sectionsInfo = getSectionsInfo(trip)

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
        [COLUMNS_NAMES_CSV.tripStartDate]: getStartDate(trip),
        [COLUMNS_NAMES_CSV.tripEndDate]: getEndDate(trip),
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
 * @returns {string}
 */
export const exportTripsToCSV = trips => {
  if (!trips || trips.length === 0) return

  const tripsData = makeTripsForExport(trips)

  if (tripsData.length > 0) {
    return convertTripsToCSV(tripsData)
  }
}
