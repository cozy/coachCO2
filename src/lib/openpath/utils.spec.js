import { keepOnlyNewTrips } from './utils'

describe('remove duplicates', () => {
  const incomingTrips = [
    {
      properties: {
        start_fmt_time: '2021-01-01T12:00:00',
        end_fmt_time: '2021-01-01T13:00:00'
      }
    },
    {
      properties: {
        start_fmt_time: '2021-01-02T12:00:00',
        end_fmt_time: '2021-01-02T13:00:00'
      }
    }
  ]

  it('should exclude all incoming trips', async () => {
    const existingTrips = [
      {
        startDate: '2021-01-01T12:00:00',
        endDate: '2021-01-01T13:00:00'
      },
      {
        startDate: '2021-01-02T12:00:00',
        endDate: '2021-01-02T13:00:00'
      }
    ]

    const tripsWithoutDuplicates = await keepOnlyNewTrips({
      incomingTrips,
      existingTrips
    })
    expect(tripsWithoutDuplicates).toEqual([])
  })
  it('should exclude oldest trip', async () => {
    const existingTrips = [
      {
        startDate: '2021-01-01T12:00:00',
        endDate: '2021-01-01T13:00:00'
      }
    ]
    const tripsWithoutDuplicates = await keepOnlyNewTrips({
      incomingTrips,
      existingTrips
    })
    expect(tripsWithoutDuplicates).toEqual([incomingTrips[1]])
  })
  it('should exclude newest trips', async () => {
    const existingTrips = [
      {
        startDate: '2021-01-02T12:00:00',
        endDate: '2021-01-02T13:00:00'
      }
    ]
    const tripsWithoutDuplicates = await keepOnlyNewTrips({
      incomingTrips,
      existingTrips
    })
    expect(tripsWithoutDuplicates).toEqual([incomingTrips[0]])
  })
  it('should deal with empty trips', async () => {
    const tripsWithoutDuplicates = await keepOnlyNewTrips({
      incomingTrips,
      existingTrips: []
    })
    expect(tripsWithoutDuplicates).toEqual(incomingTrips)
  })
})
