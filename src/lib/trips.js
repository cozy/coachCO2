import get from 'lodash/get'
import flatten from 'lodash/flatten'
import uniq from 'lodash/uniq'
import memoize from 'lodash/memoize'
import distanceInWords from 'date-fns/distance_in_words'
import humanizeDuration from 'humanize-duration'

import { UNKNOWN_MODE } from 'src/constants'
import {
  computeCaloriesTrip,
  computeCO2Trip,
  computeCO2TripByMode
} from 'src/lib/metrics'
import { modes } from 'src/components/helpers'

/**
 * Compute the percentage and returns it as a formatted string
 * @param {number} value
 * @param {number} total
 * @returns {string}
 */
export const computeFormatedPercentage = (value, total) => {
  if (total === 0) return '0%'

  const [int, dec] = ((value * 100) / total).toFixed(2).split('.')
  if (dec === '00') return `${int}%`

  return `${int}.${dec}%`
}

export const getPurpose = trip => {
  return get(trip, 'properties.manual_purpose')
}

export const getStartPlaceDisplayName = trip => {
  return get(trip, 'properties.start_place.data.properties.display_name')
}

export const getEndPlaceDisplayName = trip => {
  return get(trip, 'properties.end_place.data.properties.display_name')
}
export const getFormattedDuration = trip => {
  const startDate = new Date(trip.properties.start_fmt_time)
  const endDate = new Date(trip.properties.end_fmt_time)
  return distanceInWords(endDate, startDate)
}

const formatDistance = distance => {
  let unit = 'm'
  let formatedDistance = distance
  if (distance > 1000) {
    unit = 'km'
    formatedDistance = distance / 1000
  }
  return `${Math.round(formatedDistance)} ${unit}`
}

export const getFormattedTripDistance = trip => {
  return formatDistance(trip.properties.distance)
}

/**
 * manual_mode is created when the user edit the feature mode manualy
 * @param {object} feature - The feature from a section
 * @returns The feature's mode depending on whether it has been changed manually
 */
export const getFeatureMode = feature => {
  const manualMode = get(feature, 'properties.manual_mode', '').toUpperCase()
  const sensedOriginalMode = get(
    feature,
    'properties.sensed_mode',
    ''
  ).toUpperCase()

  const isSupportedManualMode = modes.includes(manualMode)

  const sensedMode = sensedOriginalMode.split('PREDICTEDMODETYPES.')[1]
  const isSupportedSensedMode = modes.includes(sensedMode)

  return (
    (isSupportedManualMode && manualMode) ||
    (isSupportedSensedMode && sensedMode) ||
    UNKNOWN_MODE
  )
}

const getFeatureModes = feature => {
  return feature.features.map(feature => getFeatureMode(feature))
}

const getDistance = x => {
  return get(x, 'features[0].properties.distance')
}

const tripsSortedByDistance = (a, b) => {
  return getDistance(a) > getDistance(b) ? -1 : 1
}

export const getModesSortedByDistance = trip => {
  return uniq(
    flatten(
      trip.features
        .filter(feature => feature.type === 'FeatureCollection')
        .sort(tripsSortedByDistance)
        .map(getFeatureModes)
    ).filter(Boolean)
  )
}

export const getMainMode = trip => {
  const sectionsInfo = getSectionsFromTrip(trip)

  if (sectionsInfo.length < 1) {
    return UNKNOWN_MODE
  }

  let mainSection = sectionsInfo[0]
  for (let i = 1; i < sectionsInfo.length; i++) {
    if (sectionsInfo[i].distance > mainSection.distance) {
      mainSection = sectionsInfo[i]
    }
  }
  return mainSection.mode
}

const getSectionFromFeatureColl = featureCollection => {
  return featureCollection.features.map(feature => {
    const startDate = get(feature, 'properties.start_fmt_time')
    const endDate = get(feature, 'properties.end_fmt_time')
    const speeds = get(feature, 'properties.speeds')

    return {
      id: feature.id,
      mode: getFeatureMode(feature),
      coordinates: get(feature, 'geometry.coordinates'),
      timestamps: get(feature, 'properties.timestamps'),
      distance: get(feature, 'properties.distance'), // in meters
      distances: get(feature, 'properties.distances'), // in meters (Array)
      duration: get(feature, 'properties.duration'), // in seconds
      startDate: startDate ? new Date(startDate) : startDate,
      endDate: endDate ? new Date(endDate) : endDate,
      speeds, // in m/s (Array)
      averageSpeed: speeds ? averageSpeedKmH(speeds) : undefined // in km/h
    }
  })
}

export const getSectionsFromTrip = memoize(trip => {
  return trip.features
    .filter(feature => feature.type === 'FeatureCollection')
    .flatMap(getSectionFromFeatureColl)
})

export const getSectionsFormatedFromTrip = (trip, lang) => {
  const sections = getSectionsFromTrip(trip)
  const language = ['fr', 'en'].includes(lang) ? lang : 'en'

  return sections.map(section => {
    return {
      ...section,
      distance: `${formatDistance(section.distance)}`,
      duration: `${humanizeDuration(section.duration * 1000, {
        delimiter: ' ',
        largest: 2,
        round: true,
        units: ['h', 'm'],
        language,
        languages: {
          fr: {
            d: () => 'j',
            h: () => 'h',
            m: () => 'min',
            s: () => 's',
            ms: () => 'ms'
          },
          en: {
            d: () => 'd',
            h: () => 'h',
            m: () => 'min',
            s: () => 's',
            ms: () => 'ms'
          }
        }
      })}`,
      averageSpeed: `${Math.round(section.averageSpeed)} km/h`
    }
  })
}

export const getTripStartDate = trip => {
  return new Date(trip.properties.start_fmt_time)
}

export const getTripEndDate = trip => {
  return new Date(trip.properties.end_fmt_time)
}

export const formatDate = ({ f, lang, date }) => {
  if (lang === 'fr') {
    return f(date, 'HH[h]mm')
  }
  return f(date, 'HH:mm')
}

/**
 * Get the average speed in km/h from an array of m/s values
 * @param {Array} speeds - The speed values, in m/s
 * @returns {number} The average speed, given in km/h
 */
const averageSpeedKmH = speeds => {
  const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length
  // The speed is given in m/s
  return avgSpeed * 3.6
}

export const formatCalories = calories => `${Math.round(calories)} kcal`

export const computeAndformatCaloriesTrip = trip => {
  const caloriesTrip = computeCaloriesTrip(trip)
  return formatCalories(caloriesTrip)
}

export const formatCO2 = CO2 => `${Math.round(CO2 * 100) / 100} kg`

export const computeAndFormatCO2Trip = trip => {
  const CO2Trip = computeCO2Trip(trip)
  return formatCO2(CO2Trip)
}

/**
 * Computes CO2 and return it formatted in kg
 *
 * @param {object} trip - The GeoJSON trip
 * @param {string} mode - The mode of trip
 * @returns {string} The CO2 formatted in kg
 */
export const computeAndFormatCO2TripByMode = (trip, mode) => {
  const CO2TripByMode = computeCO2TripByMode(trip, mode)
  return formatCO2(CO2TripByMode)
}
