import get from 'lodash/get'
import merge from 'lodash/merge'
import keyBy from 'lodash/keyBy'
import flatten from 'lodash/flatten'
import uniq from 'lodash/uniq'
import distanceInWords from 'date-fns/distance_in_words'
import humanizeDuration from 'humanize-duration'

import { UNKNOWN_MODE } from 'src/constants/const'
import { computeCaloriesTrip, computeCO2Trip } from 'src/lib/metrics'

export const collectFeaturesByOid = geojson => {
  const res = {}
  for (let item of geojson) {
    for (let feature of item.features) {
      res[feature.id] = feature
    }
  }
  return res
}

/**
 * Add feature data into timeserie start_place and end_place properties
 * according to $oid pointers
 */
export const transformTimeserieToTrip = timeserie => {
  const { features, properties } = timeserie
  const featureIndex = keyBy(features, feature => feature.id)

  return merge({}, timeserie, {
    properties: {
      start_place: {
        data: featureIndex[properties.start_place['$oid']]
      },
      end_place: {
        data: featureIndex[properties.end_place['$oid']]
      }
    }
  })
}

// TODO: optimize to avoid multiple map
export const transformTimeseriesToTrips = timeseries => {
  const allSeries = flatten(timeseries.map(g => g.series))
  const allSeriesWithGeojsonId = allSeries.map((s, i) => ({
    ...s,
    geojsonId: timeseries[i]._id
  }))

  return allSeriesWithGeojsonId.map(transformTimeserieToTrip)
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

export const formatTripDistance = trip => {
  return formatDistance(trip.properties.distance)
}

/**
 * manual_mode is created when the user edit the feature mode manualy
 * @param {object} feature - The feature from a section
 * @returns The feature's mode depending on whether it has been changed manually
 */
const getFeatureMode = feature => {
  const manualMode = get(feature, 'properties.manual_mode')
  const sensedOriginalMode = get(feature, 'properties.sensed_mode')
  const sensedMode =
    sensedOriginalMode && sensedOriginalMode.split('PredictedModeTypes.')[1]

  return manualMode || sensedMode
}

export const getModes = trip => {
  return uniq(
    flatten(
      trip.features.map(feature => {
        if (feature.features) {
          return feature.features.map(feature => getFeatureMode(feature))
        } else {
          return getFeatureMode(feature)
        }
      })
    ).filter(Boolean)
  )
}

export const getMainMode = trip => {
  const sectionsInfo = getSectionsInfo(trip)

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

export const getSectionsInfo = trip => {
  return flatten(
    trip.features.map(feature => {
      if (feature.features) {
        return feature.features.map(feature => {
          return {
            id: feature.id,
            mode: getFeatureMode(feature),
            distance: get(feature, 'properties.distance'), // in meters
            duration: get(feature, 'properties.duration'), // in seconds
            startDate: get(feature, 'properties.start_fmt_time'),
            endDate: get(feature, 'properties.end_fmt_time'),
            averageSpeed: averageSpeedKmH(get(feature, 'properties.speeds')) // in km/h
          }
        })
      }
    })
  ).filter(Boolean)
}

export const getSectionsFormatedInfo = (trip, lang) => {
  const sections = getSectionsInfo(trip)
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

export const getStartDate = trip => {
  return new Date(trip.properties.start_fmt_time)
}

export const getEndDate = trip => {
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

export const formatCalories = trip => {
  const caloriesTrip = computeCaloriesTrip(trip)
  return `${Math.round(caloriesTrip)} kcal`
}

export const formatCO2 = trip => {
  const CO2Trip = computeCO2Trip(trip)
  return `${Math.round(CO2Trip * 100) / 100} kg`
}
