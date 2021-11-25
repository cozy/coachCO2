import { computeCO2Trip } from './trips'
import {
  CAR_AVERAGE_CO2_KG_PER_KM,
  BUS_MEDIUM_AGGLOMERATION_CO2_KG_PER_KM,
  SUBWAY_TRAM_TROLLEYBUS_MEDIUM_AGGLOMERATION_CO2_KG_PER_KM,
  TRAIN_HIGHLINE_CO2_KG_PER_KM,
  PLANE_CO2_KG_PER_KM_SHORT,
  PLANE_CO2_KG_PER_KM_MEDIUM,
  PLANE_CO2_KG_PER_KM_LONG
} from 'src/constants/const'

const createTripFromTemplate = (
  tripTemplate,
  { mode, distance, startDate, endDate }
) => {
  const trip = { ...tripTemplate }
  trip.features[0].features[0] = {
    properties: {
      sensed_mode: `PredictedModeTypes.${mode}`,
      distance,
      start_fmt_time: startDate,
      end_fmt_time: endDate
    }
  }
  return trip
}

describe('trips', () => {
  const tripTemplate = {
    features: [
      {
        features: []
      }
    ]
  }
  it('should correctly compute the bicycling CO2', () => {
    const trip = createTripFromTemplate(tripTemplate, {
      mode: 'BICYCLING',
      distance: 2456,
      startDate: '2021-01-01T08:00:00',
      endDate: '2021-01-01T08:10:00'
    })
    const CO2 = computeCO2Trip(trip)
    expect(CO2).toEqual(0)
  })
  it('should correctly compute the walking CO2', () => {
    const trip = createTripFromTemplate(tripTemplate, {
      mode: 'WALKING',
      distance: 563,
      startDate: '2021-01-01T08:11:00',
      endDate: '2021-01-01T08:20:00'
    })
    const CO2 = computeCO2Trip(trip)
    expect(CO2).toEqual(0)
  })
  it('should correctly compute the car CO2', () => {
    const trip = createTripFromTemplate(tripTemplate, {
      mode: 'CAR',
      distance: 14789,
      startDate: '2021-01-01T08:30:00',
      endDate: '2021-01-01T09:00:00'
    })
    const CO2 = computeCO2Trip(trip)
    expect(CO2).toEqual((14789 / 1000) * CAR_AVERAGE_CO2_KG_PER_KM)
  })
  it('should correctly compute the bus CO2', () => {
    const trip = createTripFromTemplate(tripTemplate, {
      mode: 'BUS',
      distance: 5645,
      startDate: '2021-01-01T09:00:00',
      endDate: '2021-01-01T10:00:00'
    })
    const CO2 = computeCO2Trip(trip)
    expect(CO2).toEqual((5645 / 1000) * BUS_MEDIUM_AGGLOMERATION_CO2_KG_PER_KM)
  })
  it('should correctly compute the subway CO2', () => {
    const trip = createTripFromTemplate(tripTemplate, {
      mode: 'SUBWAY',
      distance: 2145,
      startDate: '2021-01-01T10:00:00',
      endDate: '2021-01-01T10:30:00'
    })
    const CO2 = computeCO2Trip(trip)
    expect(CO2).toEqual(
      (2145 / 1000) * SUBWAY_TRAM_TROLLEYBUS_MEDIUM_AGGLOMERATION_CO2_KG_PER_KM
    )
  })
  it('should correctly compute the train CO2', () => {
    const trip = createTripFromTemplate(tripTemplate, {
      mode: 'TRAIN',
      distance: 76654,
      startDate: '2021-01-01T11:00:00',
      endDate: '2021-01-01T12:00:00'
    })
    const CO2 = computeCO2Trip(trip)
    expect(CO2).toEqual((76654 / 1000) * TRAIN_HIGHLINE_CO2_KG_PER_KM)
  })
  it('should correctly compute the plane CO2', () => {
    const shortTrip = createTripFromTemplate(tripTemplate, {
      mode: 'AIR_OR_HSR',
      distance: 800000,
      startDate: '2021-01-01T13:00:00',
      endDate: '2021-01-01T14:00:00'
    })
    const shortCO2 = computeCO2Trip(shortTrip)
    expect(shortCO2).toEqual((800000 / 1000) * PLANE_CO2_KG_PER_KM_SHORT)

    const mediumTrip = createTripFromTemplate(tripTemplate, {
      mode: 'AIR_OR_HSR',
      distance: 2000000,
      startDate: '2021-01-01T15:00:00',
      endDate: '2021-01-01T17:00:00'
    })
    const mediumCO2 = computeCO2Trip(mediumTrip)
    expect(mediumCO2).toEqual((2000000 / 1000) * PLANE_CO2_KG_PER_KM_MEDIUM)

    const longTrip = createTripFromTemplate(tripTemplate, {
      mode: 'AIR_OR_HSR',
      distance: 5000000,
      startDate: '2021-01-01T18:00:00',
      endDate: '2021-01-01T23:00:00'
    })
    const longCO2 = computeCO2Trip(longTrip)
    expect(longCO2).toEqual((5000000 / 1000) * PLANE_CO2_KG_PER_KM_LONG)
  })
})
