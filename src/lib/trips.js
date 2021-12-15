import get from 'lodash/get'
import merge from 'lodash/merge'
import keyBy from 'lodash/keyBy'
import flatten from 'lodash/flatten'
import uniq from 'lodash/uniq'
import distanceInWords from 'date-fns/distance_in_words'

import { UNKNOWN_MODE } from 'src/constants/const'

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

export const transformTimeSeriesToTrips = geojsonTimeseries => {
  const allSeries = flatten(geojsonTimeseries.map(g => g.series))
  return allSeries.map(transformSingleTimeSeriesToTrips)
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

export const formatDistance = trip => {
  let unit = 'm'
  let distance = trip.properties.distance
  if (distance > 1000) {
    unit = 'km'
    distance = distance / 1000
  }
  return `${Math.round(distance)} ${unit}`
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

export const getStartDate = trip => {
  return new Date(trip.properties.start_fmt_time)
}

/**
 * Get the average speed in km/h from an array of m/s values
 * @param {Array} speeds - The speed values, in m/s
 * @returns {number} The average speed, given in km/s
 */
const averageSpeedKmH = speeds => {
  const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length
  // The speed is given in m/s
  return avgSpeed * 3.6
}