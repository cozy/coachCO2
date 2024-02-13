import { calculateRemainingDays } from 'src/lib/geolocationQuota/lib'

const EMPTY_TIMESERIE = { data: [] }
const FIRST_JANUARY_TIMESERIE = {
  data: [
    {
      startDate: '2024-01-01T00:00:00.000Z'
    }
  ]
}

describe('calculateRemainingDays', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern')
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('should return Infinity if no first query', async () => {
    // Given
    const client = {
      query: jest.fn(() => {
        return EMPTY_TIMESERIE
      })
    }
    const maxDaysToCapture = 10

    // When
    const remainingDays = await calculateRemainingDays(client, maxDaysToCapture)

    // Then
    expect(remainingDays).toBe(Number.POSITIVE_INFINITY)
  })

  it('should return Infinity if no max days to capture', async () => {
    // Given
    const client = {
      query: () => {
        return FIRST_JANUARY_TIMESERIE
      }
    }
    const maxDaysToCapture = undefined

    // When
    const remainingDays = await calculateRemainingDays(client, maxDaysToCapture)

    // Then
    expect(remainingDays).toBe(Number.POSITIVE_INFINITY)
  })

  it('should return Infinity if max days to capture unlimited', async () => {
    // Given
    const client = {
      query: () => {
        return FIRST_JANUARY_TIMESERIE
      }
    }
    const maxDaysToCapture = -1

    // When
    const remainingDays = await calculateRemainingDays(client, maxDaysToCapture)

    // Then
    expect(remainingDays).toBe(Number.POSITIVE_INFINITY)
  })

  it('should return positive remaining days', async () => {
    // Given
    const client = {
      query: () => {
        return FIRST_JANUARY_TIMESERIE
      }
    }
    jest.setSystemTime(new Date('2024-01-10T00:00:00.000Z'))
    const maxDaysToCapture = 15

    // When
    const remainingDays = await calculateRemainingDays(client, maxDaysToCapture)

    // Then
    expect(remainingDays).toBe(6)
  })

  it('should return 0 remaining days', async () => {
    // Given
    const client = {
      query: () => {
        return FIRST_JANUARY_TIMESERIE
      }
    }
    jest.setSystemTime(new Date('2024-01-16T00:00:00.000Z'))
    const maxDaysToCapture = 15

    // When
    const remainingDays = await calculateRemainingDays(client, maxDaysToCapture)

    // Then
    expect(remainingDays).toBe(0)
  })

  it('should return negative remaining days', async () => {
    // Given
    const client = {
      query: () => {
        return FIRST_JANUARY_TIMESERIE
      }
    }
    jest.setSystemTime(new Date('2024-01-20T00:00:00.000Z'))
    const maxDaysToCapture = 15

    // When
    const remainingDays = await calculateRemainingDays(client, maxDaysToCapture)

    // Then
    expect(remainingDays).toBe(-4)
  })
})
