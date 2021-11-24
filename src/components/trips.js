import get from 'lodash/get'
import merge from 'lodash/merge'
import keyBy from 'lodash/keyBy'
import flatten from 'lodash/flatten'
import uniq from 'lodash/uniq'
import distanceInWords from 'date-fns/distance_in_words'

import {
  AIR_MODE,
  BUS_MODE,
  CAR_MODE,
  SUBWAY_MODE,
  TRAIN_MODE,
  UNKNOWN_MODE,
  PLANE_CO2_KG_PER_KM_SHORT,
  PLANE_CO2_KG_PER_KM_MEDIUM,
  PLANE_CO2_KG_PER_KM_LONG,
  SHORT_PLANE_TRIP_MAX_DISTANCE,
  MEDIUM_PLANE_TRIP_MAX_DISTANCE,
  CAR_AVERAGE_CO2_KG_PER_KM,
  BUS_MEDIUM_AGGLOMERATION_CO2_KG_PER_KM,
  TRAIN_HIGHLINE_CO2_KG_PER_KM,
  SUBWAY_TRAM_TROLLEYBUS_MEDIUM_AGGLOMERATION_CO2_KG_PER_KM
} from 'src/constants/const'

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
            distance: get(feature, 'properties.distance'),
            duration: get(feature, 'properties.duration'),
            startDate: get(feature, 'properties.start_fmt_time'),
            endDate: get(feature, 'properties.end_fmt_time')
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
 * Compute the total CO2 consumed by the trip.
 * For each section, compute the related consumed CO2 based on the mode and distance.
 * See the src/constants/const.js file for more insights about the CO2 values
 *
 * @param {object} trip - The GeoJSON trip
 * @returns {number} The consumed CO2, in kg
 */
export const computeCO2Trip = trip => {
  const sections = getSectionsInfo(trip)
  let totalCO2 = 0
  for (const section of sections) {
    const distance = section.distance / 1000 // convert in km
    switch (section.mode) {
      case AIR_MODE:
        if (distance <= SHORT_PLANE_TRIP_MAX_DISTANCE) {
          totalCO2 += distance * PLANE_CO2_KG_PER_KM_SHORT
          break
        } else if (distance <= MEDIUM_PLANE_TRIP_MAX_DISTANCE) {
          totalCO2 += distance * PLANE_CO2_KG_PER_KM_MEDIUM
        } else {
          totalCO2 += distance * PLANE_CO2_KG_PER_KM_LONG
        }
        break
      case CAR_MODE:
        // TODO: should depends on the energy type + number of passengers
        totalCO2 += distance * CAR_AVERAGE_CO2_KG_PER_KM
        break
      case BUS_MODE:
        // TODO: should depends on the area
        totalCO2 += distance * BUS_MEDIUM_AGGLOMERATION_CO2_KG_PER_KM
        break
      case SUBWAY_MODE:
        // TODO: should depends on the area
        totalCO2 +=
          distance * SUBWAY_TRAM_TROLLEYBUS_MEDIUM_AGGLOMERATION_CO2_KG_PER_KM
        break
      case TRAIN_MODE:
        // TODO: should depends on train type
        totalCO2 += distance * TRAIN_HIGHLINE_CO2_KG_PER_KM
        break
      case UNKNOWN_MODE:
        break
      default:
        break
    }
  }
  return totalCO2
}
