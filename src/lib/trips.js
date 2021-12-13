import get from 'lodash/get'
import merge from 'lodash/merge'
import keyBy from 'lodash/keyBy'
import flatten from 'lodash/flatten'
import uniq from 'lodash/uniq'
import distanceInWords from 'date-fns/distance_in_words'
import format from 'date-fns/format'
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
 * Prepare timeseries for easier consumption by React components
 *
 * Resolves $oid pointers for start_place and end_place
 */
export const transformSingleTimeSeriesToTrips = singleTimeseries => {
  const { features, properties } = singleTimeseries
  const featureIndex = keyBy(features, feature => feature.id)
  return merge({}, singleTimeseries, {
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
export const transformTimeSeriesToTrips = geojsonTimeseries => {
  const allSeries = flatten(geojsonTimeseries.map(g => g.series))
  const allSeriesWithGeojsonId = allSeries.map((s, i) => ({
    ...s,
    geojsonId: geojsonTimeseries[i]._id
  }))

  return allSeriesWithGeojsonId.map(transformSingleTimeSeriesToTrips)
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

export const getModes = trip => {
  return uniq(
    flatten(
      trip.features.map(feature => {
        if (feature.features) {
          return feature.features.map(feature =>
            get(feature, 'properties.sensed_mode')
          )
        } else {
          return get(feature, 'properties.sensed_mode')
        }
      })
    )
      .map(x => (x ? x.split('PredictedModeTypes.')[1] : null))
      .filter(Boolean)
  )
}

export const getMainMode = trip => {
  const sectionsInfo = getSectionsInfo(trip)

  if (sectionsInfo.lengtth < 1) {
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
            mode: get(feature, 'properties.sensed_mode').split(
              'PredictedModeTypes.'
            )[1],
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

export const getSectionsFormatedInfo = trip => {
  const sections = getSectionsInfo(trip)

  return sections.map(section => {
    return {
      ...section,
      distance: `${formatDistance(section.distance)}`,
      duration: `${humanizeDuration(section.duration * 1000, {
        delimiter: ' ',
        largest: 2,
        round: true,
        units: ['h', 'm'],
        language: 'shortEn',
        languages: {
          shortEn: {
            h: () => 'h',
            m: () => 'min',
            s: () => 'sec',
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

export const getTime = date => {
  return format(date, 'HH[h]mm')
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
  return `${Math.round(CO2Trip)} kg`
}
