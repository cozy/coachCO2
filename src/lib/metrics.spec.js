import {
  CAR_AVERAGE_CO2_KG_PER_KM,
  BUS_MEDIUM_AGGLOMERATION_CO2_KG_PER_KM,
  SUBWAY_TRAM_TROLLEYBUS_MEDIUM_AGGLOMERATION_CO2_KG_PER_KM,
  TRAIN_HIGHLINE_CO2_KG_PER_KM,
  PLANE_CO2_KG_PER_KM_SHORT,
  PLANE_CO2_KG_PER_KM_MEDIUM,
  PLANE_CO2_KG_PER_KM_LONG,
  MET_WALKING_SLOW,
  MET_WALKING_MEDIUM,
  MET_WALKING_FAST,
  MET_WALKING_VERY_FAST,
  MET_BICYCLING_SLOW,
  MET_BICYCLING_MEDIUM,
  MET_BICYCLING_FAST,
  MET_BICYCLING_VERY_FAST
} from 'src/constants/const'
import {
  createTripFromTemplate,
  tripTemplate,
  makeBicycleTrip,
  makeWalkingTrip,
  makeCarTrip
} from 'test/mockTrip'
import { computeCO2Trip, computeCaloriesTrip, caloriesFormula } from './metrics'

describe('computeCO2Trip', () => {
  it('should correctly compute the bicycling CO2', () => {
    const CO2 = computeCO2Trip(makeBicycleTrip())
    expect(CO2).toEqual(0)
  })

  it('should correctly compute the walking CO2', () => {
    const CO2 = computeCO2Trip(makeWalkingTrip())
    expect(CO2).toEqual(0)
  })

  it('should correctly compute the car CO2', () => {
    const CO2 = computeCO2Trip(makeCarTrip())
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

describe('computeCaloriesTrip', () => {
  it('should correctly compute walking calories', () => {
    const startDate = new Date('2021-01-01T09:00:00')
    const endDate = new Date('2021-01-01T10:00:00')
    const duration = endDate - startDate

    const slowWalkingTrip = createTripFromTemplate(tripTemplate, {
      mode: 'WALKING',
      distance: 2456,
      startDate: startDate,
      endDate: endDate,
      duration: duration,
      speeds: [0.1] // 0,36 km/h
    })
    const slowCalories = computeCaloriesTrip(slowWalkingTrip)
    const expectedSlowCalories = caloriesFormula(
      MET_WALKING_SLOW,
      duration / 60
    )
    expect(slowCalories).toEqual(expectedSlowCalories)

    const mediumWalkingTrip = createTripFromTemplate(tripTemplate, {
      mode: 'WALKING',
      distance: 2456,
      startDate: startDate,
      endDate: endDate,
      duration: duration,
      speeds: [1] // 3.6km/h
    })
    const mediumCalories = computeCaloriesTrip(mediumWalkingTrip)
    const expectedMediumCalories = caloriesFormula(
      MET_WALKING_MEDIUM,
      duration / 60
    )
    expect(mediumCalories).toEqual(expectedMediumCalories)

    const fastWalkingTrip = createTripFromTemplate(tripTemplate, {
      mode: 'WALKING',
      distance: 2456,
      startDate: startDate,
      endDate: endDate,
      duration: duration,
      speeds: [1.5] // 5,4km/h
    })
    const fastCalories = computeCaloriesTrip(fastWalkingTrip)
    const expectedFastCalories = caloriesFormula(
      MET_WALKING_FAST,
      duration / 60
    )
    expect(fastCalories).toEqual(expectedFastCalories)

    const veryFastWalkingTrip = createTripFromTemplate(tripTemplate, {
      mode: 'WALKING',
      distance: 2456,
      startDate: startDate,
      endDate: endDate,
      duration: duration,
      speeds: [2] // 7.2km/h
    })
    const veryFastCalories = computeCaloriesTrip(veryFastWalkingTrip)
    const expectedveryFastCalories = caloriesFormula(
      MET_WALKING_VERY_FAST,
      duration / 60
    )
    expect(veryFastCalories).toEqual(expectedveryFastCalories)
  })

  it('should correctly compute bicycling calories', () => {
    const startDate = new Date('2021-01-01T09:00:00')
    const endDate = new Date('2021-01-01T09:15:00')
    const duration = endDate - startDate

    const slowBicyclingTrip = createTripFromTemplate(tripTemplate, {
      mode: 'BICYCLING',
      distance: 2456,
      startDate: startDate,
      endDate: endDate,
      duration: duration,
      speeds: [1] // 3.6 km/h
    })
    const slowCalories = computeCaloriesTrip(slowBicyclingTrip)
    const expectedSlowCalories = caloriesFormula(
      MET_BICYCLING_SLOW,
      duration / 60
    )
    expect(slowCalories).toEqual(expectedSlowCalories)

    const mediumBicyclingTrip = createTripFromTemplate(tripTemplate, {
      mode: 'BICYCLING',
      distance: 2456,
      startDate: startDate,
      endDate: endDate,
      duration: duration,
      speeds: [5] // 18km/h
    })
    const mediumCalories = computeCaloriesTrip(mediumBicyclingTrip)
    const expectedMediumCalories = caloriesFormula(
      MET_BICYCLING_MEDIUM,
      duration / 60
    )
    expect(mediumCalories).toEqual(expectedMediumCalories)

    const fastBicyclingTrip = createTripFromTemplate(tripTemplate, {
      mode: 'BICYCLING',
      distance: 2456,
      startDate: startDate,
      endDate: endDate,
      duration: duration,
      speeds: [7] // 25,2km/h
    })
    const fastCalories = computeCaloriesTrip(fastBicyclingTrip)
    const expectedFastCalories = caloriesFormula(
      MET_BICYCLING_FAST,
      duration / 60
    )
    expect(fastCalories).toEqual(expectedFastCalories)

    const veryFastBicyclingTrip = createTripFromTemplate(tripTemplate, {
      mode: 'BICYCLING',
      distance: 2456,
      startDate: startDate,
      endDate: endDate,
      duration: duration,
      speeds: [10] // 36km/h
    })
    const veryFastCalories = computeCaloriesTrip(veryFastBicyclingTrip)
    const expectedveryFastCalories = caloriesFormula(
      MET_BICYCLING_VERY_FAST,
      duration / 60
    )
    expect(veryFastCalories).toEqual(expectedveryFastCalories)
  })
})
