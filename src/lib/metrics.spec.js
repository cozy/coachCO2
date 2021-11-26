import { computeCaloriesTrip, caloriesFormula } from './metrics'
import {
  MET_WALKING_SLOW,
  MET_WALKING_MEDIUM,
  MET_WALKING_FAST,
  MET_WALKING_VERY_FAST,
  MET_BICYCLING_SLOW,
  MET_BICYCLING_MEDIUM,
  MET_BICYCLING_FAST,
  MET_BICYCLING_VERY_FAST
} from 'src/constants/const'

const createTripFromTemplate = (
  tripTemplate,
  { mode, distance, startDate, endDate, duration, speeds }
) => {
  const trip = { ...tripTemplate }
  const tripSpeeds = speeds || [1]
  trip.features[0].features[0] = {
    properties: {
      sensed_mode: `PredictedModeTypes.${mode}`,
      distance,
      start_fmt_time: startDate,
      end_fmt_time: endDate,
      duration,
      speeds: tripSpeeds
    }
  }
  return trip
}

const tripTemplate = {
  features: [
    {
      features: []
    }
  ]
}

describe('Calories', () => {
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
