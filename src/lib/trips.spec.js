import { makeBicycleTrip, makeWalkingTrip, makeCarTrip } from 'test/mockTrip'

import {
  computeAndformatCaloriesTrip,
  computeAndFormatCO2Trip,
  getSectionsFormatedInfo
} from './trips'

describe('computeAndformatCaloriesTrip', () => {
  it('should return formated value', () => {
    const bCalories = computeAndformatCaloriesTrip(makeBicycleTrip())
    expect(bCalories).toBe('75 kcal')

    const wCalories = computeAndformatCaloriesTrip(makeWalkingTrip())
    expect(wCalories).toBe('41 kcal')
  })
})

describe('computeAndFormatCO2Trip', () => {
  it('should return formated value', () => {
    const bCO2 = computeAndFormatCO2Trip(makeBicycleTrip())
    expect(bCO2).toBe('0 kg')

    const cCO2 = computeAndFormatCO2Trip(makeCarTrip())
    expect(cCO2).toBe('2.84 kg')
  })
})

describe('getSectionsFormatedInfo', () => {
  it('should return formated value', () => {
    const bicyleInfos = getSectionsFormatedInfo(makeBicycleTrip(), 'en')
    expect(bicyleInfos[0]).toMatchObject({
      distance: '2 km',
      duration: '10 min',
      averageSpeed: '4 km/h'
    })
  })
})
