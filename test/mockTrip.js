export const tripTemplate = {
  features: [
    {
      features: []
    }
  ]
}

export const createTripFromTemplate = (
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

export const makeBicycleTrip = () =>
  createTripFromTemplate(tripTemplate, {
    mode: 'BICYCLING',
    distance: 2456,
    duration: 600,
    startDate: '2021-01-01T08:00:00',
    endDate: '2021-01-01T08:10:00'
  })

export const makeWalkingTrip = () =>
  createTripFromTemplate(tripTemplate, {
    mode: 'WALKING',
    distance: 563,
    duration: 540,
    startDate: '2021-01-01T08:11:00',
    endDate: '2021-01-01T08:20:00'
  })

export const makeCarTrip = () =>
  createTripFromTemplate(tripTemplate, {
    mode: 'CAR',
    distance: 14789,
    duration: 1800,
    startDate: '2021-01-01T08:30:00',
    endDate: '2021-01-01T09:00:00'
  })
