import {
  GROUP_ID,
  computeRawMeasures,
  getMainModeFromSections,
  sanityChecks
} from './daccCentreValDeLoireExpe'

describe('computeRawMeasures', () => {
  it('should return null for empty or undefined timeseries', () => {
    expect(computeRawMeasures([])).toBeNull()
  })

  it('should handle timeseries without aggregation', () => {
    const timeseries = [{ aggregation: null }]
    expect(computeRawMeasures(timeseries)).toEqual({
      sectionMeasures: {},
      tripMeasures: {}
    })
  })

  it('should compute section measures correctly for valid timeseries with start/end place', () => {
    const timeseries = [
      {
        startPlaceContact: {
          displayName: 'Poudlard',
          relationships: { groups: { data: [{ _id: GROUP_ID }] } }
        },
        endPlaceContact: {
          displayName: 'Home'
        },
        aggregation: {
          sections: [
            { mode: 'bus', CO2: 10, duration: 30, distance: 3000 },
            { mode: 'walk', CO2: 0, duration: 10, distance: 500 }
          ]
        }
      },
      {
        startPlaceContact: {
          displayName: 'Poudlard',
          relationships: { groups: { data: [{ _id: GROUP_ID }] } }
        },

        endPlaceContact: {
          displayName: 'Poudlard',
          relationships: { groups: { data: [{ _id: GROUP_ID }] } }
        },
        aggregation: {
          sections: [{ mode: 'walk', CO2: 0, duration: 20, distance: 1000 }]
        }
      },
      {
        endPlaceContact: {
          displayName: 'Poudlard',
          relationships: { groups: { data: [{ _id: GROUP_ID }] } }
        },
        aggregation: {
          sections: [
            { mode: 'walk', CO2: 0, duration: 10, distance: 500 },
            { mode: 'bus', CO2: 10, duration: 30, distance: 5000 },
            { mode: 'walk', CO2: 0, duration: 5, distance: 100 }
          ]
        }
      }
    ]
    const expected = {
      'bus/Poudlard/outward/1': {
        count: 1,
        sumCO2: 10,
        sumDuration: 30,
        sumDistance: 5000
      },
      'bus/Poudlard/return/1': {
        count: 1,
        sumCO2: 10,
        sumDistance: 3000,
        sumDuration: 30
      },
      'walk/Poudlard/outward/0': {
        count: 2,
        sumCO2: 0,
        sumDuration: 15,
        sumDistance: 600
      },
      'walk/Poudlard/return/0': {
        count: 1,
        sumCO2: 0,
        sumDuration: 10,
        sumDistance: 500
      },
      'walk/Poudlard/round/1': {
        count: 1,
        sumCO2: 0,
        sumDuration: 20,
        sumDistance: 1000
      }
    }

    expect(computeRawMeasures(timeseries)).toMatchObject({
      sectionMeasures: expected
    })
  })

  it('should compute section measures correctly for valid timeseries without start/end place', () => {
    const timeseries = [
      {
        aggregation: {
          sections: [
            { mode: 'car', CO2: 10, duration: 30, distance: 10000 },
            { mode: 'bike', CO2: 0, duration: 10, distance: 2000 }
          ]
        }
      },
      {
        aggregation: {
          sections: [{ mode: 'walk', CO2: 0, duration: 20, distance: 1500 }]
        }
      }
    ]
    const expected = {
      'car//none/1': {
        count: 1,
        sumCO2: 10,
        sumDuration: 30,
        sumDistance: 10000
      },
      'bike//none/0': {
        count: 1,
        sumCO2: 0,
        sumDuration: 10,
        sumDistance: 2000
      },
      'walk//none/1': {
        count: 1,
        sumCO2: 0,
        sumDuration: 20,
        sumDistance: 1500
      }
    }

    expect(computeRawMeasures(timeseries)).toMatchObject({
      sectionMeasures: expected
    })
  })

  it('should correctly aggregate section measures', () => {
    const timeseries = [
      {
        aggregation: {
          sections: [
            { mode: 'car', CO2: 10, duration: 30, distance: 10000 },
            { mode: 'bike', CO2: 0, duration: 10, distance: 2000 }
          ]
        }
      },
      {
        aggregation: {
          sections: [{ mode: 'car', CO2: 50, duration: 20, distance: 5000 }]
        }
      },
      {
        aggregation: {
          sections: [
            { mode: 'car', CO2: 0, duration: 20, distance: 4000 },
            { mode: 'bike', CO2: 0, duration: 10, distance: 2000 }
          ]
        }
      }
    ]

    const expected = {
      'car//none/1': {
        count: 3,
        sumCO2: 60,
        sumDuration: 70,
        sumDistance: 19000
      },
      'bike//none/0': {
        count: 2,
        sumCO2: 0,
        sumDuration: 20,
        sumDistance: 4000
      }
    }

    expect(computeRawMeasures(timeseries)).toMatchObject({
      sectionMeasures: expected
    })
  })

  it('should correctly aggregate trip measures', () => {
    const timeseries = [
      {
        aggregation: {
          modes: ['car'],
          totalCO2: 100,
          totalDistance: 20,
          totalDuration: 10
        }
      },
      {
        aggregation: {
          modes: ['bike', 'walk', 'bike'],
          totalCO2: 0,
          totalDistance: 10,
          totalDuration: 5
        }
      },
      {
        aggregation: {
          modes: ['car', 'car'],
          totalCO2: 200,
          totalDistance: 90,
          totalDuration: 120
        }
      }
    ]

    const expected = {
      'car//none/unknown': {
        count: 2,
        sumCO2: 300,
        sumDuration: 130,
        sumDistance: 110
      },
      'bike:walk//none/unknown': {
        count: 1,
        sumCO2: 0,
        sumDuration: 5,
        sumDistance: 10
      }
    }

    expect(computeRawMeasures(timeseries)).toMatchObject({
      tripMeasures: expected
    })
  })

  it('should correctly set trip direction', () => {
    const timeseries = [
      {
        startPlaceContact: {
          displayName: 'Poudlard',
          relationships: { groups: { data: [{ _id: GROUP_ID }] } }
        },
        endPlaceContact: {
          displayName: 'Home'
        },
        aggregation: {
          sections: [{ mode: 'bus', CO2: 10, duration: 30, distance: 3000 }]
        }
      },
      {
        startPlaceContact: {
          displayName: 'Poudlard',
          relationships: { groups: { data: [{ _id: GROUP_ID }] } }
        },
        endPlaceContact: {
          displayName: 'Poudlard',
          relationships: { groups: { data: [{ _id: GROUP_ID }] } }
        },
        aggregation: {
          sections: [{ mode: 'walk', CO2: 0, duration: 20, distance: 1000 }]
        }
      },
      {
        endPlaceContact: {
          displayName: 'Poudlard',
          relationships: { groups: { data: [{ _id: GROUP_ID }] } }
        },
        aggregation: {
          sections: [{ mode: 'bus', CO2: 10, duration: 30, distance: 5000 }]
        }
      }
    ]
    const expected = {
      'bus/Poudlard/outward/1': {},
      'bus/Poudlard/return/1': {},
      'walk/Poudlard/round/1': {}
    }
    expect(computeRawMeasures(timeseries)).toMatchObject({
      sectionMeasures: expected
    })
  })

  it('should correctly set main mode', () => {
    const timeseries = [
      {
        aggregation: {
          sections: [
            { mode: 'car', CO2: 10, duration: 30, distance: 10000 },
            { mode: 'bike', CO2: 0, duration: 10, distance: 2000 }
          ]
        }
      },
      {
        aggregation: {
          sections: [{ mode: 'car', CO2: 50, duration: 20, distance: 5000 }]
        }
      },
      {
        aggregation: {
          sections: [
            { mode: 'car', CO2: 0, duration: 10, distance: 2000 },
            { mode: 'bike', CO2: 0, duration: 20, distance: 4000 }
          ]
        }
      }
    ]
    const expected = {
      'car//none/0': {},
      'car//none/1': {},
      'bike//none/0': {},
      'bike//none/1': {}
    }
    expect(computeRawMeasures(timeseries)).toMatchObject({
      sectionMeasures: expected
    })
  })
})

describe('getMainModeFromSections', () => {
  it('should return the mode with the greait distance', () => {
    const sections = [
      { mode: 'car', distance: 10 },
      { mode: 'bike', distance: 5 },
      { mode: 'car', distance: 15 }
    ]
    expect(getMainModeFromSections(sections)).toBe('car')
  })

  it('should return null when there is no section', () => {
    expect(getMainModeFromSections([])).toBeNull()
  })

  it('should handle a single section', () => {
    const sections = [{ mode: 'walk', distance: 20 }]
    expect(getMainModeFromSections(sections)).toBe('walk')
  })
})

describe('sanity checks', () => {
  it('should return an error when negative values are met', () => {
    const measures = {
      1: { count: -1, sumCO2: -10, sumDuration: 10 }
    }
    const errors = sanityChecks(measures)
    expect(errors.length).toEqual(2)
  })
  it('should return nothing when nothing wrong', () => {
    const measures = {
      1: { count: 1, sumCO2: 10, sumDuration: 10 }
    }
    const errors = sanityChecks(measures)
    expect(errors.length).toEqual(0)
  })
})
