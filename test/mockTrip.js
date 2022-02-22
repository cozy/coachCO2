import cloneDeep from 'lodash/cloneDeep'

import { DOCTYPE_GEOJSON } from 'src/constants/const'

export const tripTemplate = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'FeatureCollection',
      features: []
    }
  ]
}

export const modeProps = {
  bicycle: {
    mode: 'BICYCLING',
    distance: 2456,
    duration: 600,
    startDate: '2021-01-01T08:00:00',
    endDate: '2021-01-01T08:10:00'
  },
  walking: {
    mode: 'WALKING',
    distance: 563,
    duration: 540,
    startDate: '2021-01-01T08:11:00',
    endDate: '2021-01-01T08:20:00'
  },
  car: {
    mode: 'CAR',
    distance: 14789,
    duration: 1800,
    startDate: '2021-01-01T08:30:00',
    endDate: '2021-01-01T09:00:00'
  },
  plane: {
    mode: 'AIR_OR_HSR',
    distance: 504789,
    duration: 1800,
    startDate: '2021-01-01T08:30:00',
    endDate: '2021-01-01T09:00:00'
  }
}

export const createTripFromTemplate = (
  tripTemplate,
  { mode, distance, startDate, endDate, duration, speeds }
) => {
  const trip = cloneDeep(tripTemplate)
  trip.features[0].features[0] = {
    properties: {
      sensed_mode: `PredictedModeTypes.${mode}`,
      distance,
      start_fmt_time: startDate,
      end_fmt_time: endDate,
      duration,
      speeds: speeds || [1]
    }
  }
  return trip
}

export const makeBicycleTrip = () =>
  createTripFromTemplate(tripTemplate, modeProps.bicycle)
export const makeBicycleFeature = id => mockFeature(id, modeProps.bicycle)

export const makeWalkingTrip = () =>
  createTripFromTemplate(tripTemplate, modeProps.walking)
export const makeWalkingFeature = id => mockFeature(id, modeProps.walking)

export const makeCarTrip = () =>
  createTripFromTemplate(tripTemplate, modeProps.car)
export const makeCarFeature = id => mockFeature(id, modeProps.car)

export const makePlaneTrip = () => {
  return createTripFromTemplate(tripTemplate, modeProps.plane)
}
export const makePlaneFeature = id => mockFeature(id, modeProps.plane)

export const mockFeature = (id, props) => {
  return {
    id,
    type: 'Feature',
    geometry: {},
    properties: props
      ? {
          sensed_mode: props.mode ? `PredictedModeTypes.${props.mode}` : '',
          distance: props.distance || '',
          start_fmt_time: props.startDate || '',
          end_fmt_time: props.endDate || '',
          duration: props.duration || '',
          speeds: props.speeds || [1]
        }
      : {}
  }
}

export const mockFeatureCollection = (id, features) => ({
  id,
  type: 'FeatureCollection',
  properties: {},
  features
})

export const mockSerie = (
  id = 'serieId01',
  features,
  { manual_purpose } = {}
) => ({
  id,
  type: 'FeatureCollection',
  properties: {
    start_place: { $oid: 'sectionId01' },
    end_place: { $oid: 'sectionId02' },
    manual_purpose
  },
  features: features || [
    mockFeature('sectionId01'),
    mockFeature('sectionId02'),
    mockFeatureCollection('sectionId03', [mockFeature('featureId01')])
  ]
})

export const mockTimeserie = (id = 'timeserieId01', series) => {
  return {
    _id: id,
    id,
    _type: DOCTYPE_GEOJSON,
    cozyMetadata: {},
    startDate: '',
    endDate: '',
    source: '',
    series
  }
}
