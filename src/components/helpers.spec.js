import { modeToCO2PerKm, getAverageCO2PerKmByMode, modes } from './helpers'

describe('getAverageCO2PerKmByMode', () => {
  it('should return average CO2 emission by mode', () => {
    const res = modes.map(mode => getAverageCO2PerKmByMode(mode))
    const expected = [
      0.199, // AIR_MODE
      0, // BICYCLING_ELECTRIC_MODE
      0, // BICYCLING_MODE
      0.0217, // BUS_ELECTRIC_MODE
      0.13733, // BUS_MODE
      0.0198, // CAR_ELECTRIC_MODE
      0.192, // CAR_MODE
      0.0099, // CARPOOL_ELECTRIC_MODE
      0.096, // CARPOOL_MODE
      0.0604, // MOTO_INF_250_MODE
      0.165, // MOTO_SUP_250_MODE
      0, // SCOOTER_ELECTRIC_MODE
      0.064, // SCOOTER_MODE
      0.0033, // SUBWAY_MODE
      0.01061, // TRAIN_MODE
      0, // UNKNOWN_MODE
      0 // WALKING_MODE
    ]

    expect(res).toEqual(expected)
  })
})

describe('modeToCO2PerKm', () => {
  it('should ', () => {
    const res = modes.map(mode => modeToCO2PerKm(mode))
    const expected = [
      199, // AIR_MODE
      0, // BICYCLING_ELECTRIC_MODE
      0, // BICYCLING_MODE
      22, // BUS_ELECTRIC_MODE
      137, // BUS_MODE
      20, // CAR_ELECTRIC_MODE
      192, // CAR_MODE
      10, // CARPOOL_ELECTRIC_MODE
      96, // CARPOOL_MODE
      60, // MOTO_INF_250_MODE
      165, // MOTO_SUP_250_MODE
      0, // SCOOTER_ELECTRIC_MODE
      64, // SCOOTER_MODE
      3, // SUBWAY_MODE
      11, // TRAIN_MODE
      0, // UNKNOWN_MODE
      0 // WALKING_MODE
    ]

    expect(res).toEqual(expected)
  })
})
