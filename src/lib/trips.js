import get from 'lodash/get'
import memoize from 'lodash/memoize'
import { modes } from 'src/components/helpers'
import { UNKNOWN_MODE } from 'src/constants'
import { averageSpeedKmH } from 'src/lib/helpers'

export const getManualPurpose = trip => {
  return get(trip, 'properties.manual_purpose')
}

export const getAutomaticPurpose = trip => {
  return trip?.properties?.automatic_purpose
}

export const getStartPlaceDisplayName = trip => {
  return get(trip, 'properties.start_place.data.properties.display_name')
}

export const getEndPlaceDisplayName = trip => {
  return get(trip, 'properties.end_place.data.properties.display_name')
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

export const getTripStartDate = trip => {
  return new Date(trip.properties.start_fmt_time)
}

export const getTripEndDate = trip => {
  return new Date(trip.properties.end_fmt_time)
}
