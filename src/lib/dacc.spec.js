import { createMockClient, models } from 'cozy-client'
const { sendMeasureToDACC, fetchAggregatesFromDACC } = models.dacc
import { DACC_REMOTE_DOCTYPE } from 'src/doctypes'
import { DACC_MEASURE_NAME_CO2_MONTHLY } from 'src/constants'
import * as dacc from './dacc'
import MockDate from 'mockdate'

jest.mock('cozy-client', () => ({
  ...jest.requireActual('cozy-client'),
  models: {
    dacc: {
      sendMeasureToDACC: jest.fn(),
      fetchAggregatesFromDACC: jest.fn()
    }
  }
}))
jest.mock('cozy-flags')

const mockedCurrentDate = '2022-04-12T11:01:58.135Z'

jest.mock('date-fns/isThisMonth', () => date => {
  if (!date) {
    return false
  }
  return (
    new Date(mockedCurrentDate).getMonth() === date.getMonth() &&
    new Date(mockedCurrentDate).getYear() === date.getYear()
  )
})

const mockClient = createMockClient({})

const januaryTimeseries = [
  {
    _id: 'timeserie1',
    startDate: '2022-01-01T12:00:00',
    endDate: '2022-01-01T16:00:00',
    aggregation: {
      totalCO2: 13
    }
  },
  {
    _id: 'timeserie2',
    startDate: '2022-01-03T08:00:00',
    endDate: '2022-01-03T09:00:00',
    aggregation: {
      totalCO2: 0
    }
  },
  {
    _id: 'timeserie3',
    startDate: '2022-01-04T17:00:00',
    endDate: '2022-01-04T19:00:00',
    aggregation: {
      totalCO2: 26
    }
  }
]
const februaryTimeseries = [
  {
    _id: 'timeserie4',
    startDate: '2022-02-12T14:00:00',
    endDate: '2022-02-12T18:00:00',
    aggregation: {
      totalCO2: 53
    }
  }
]
const marchTimeseries = [
  {
    _id: 'timeserie5',
    startDate: '2022-03-01T02:00:00',
    endDate: '2022-02-12T03:00:00',
    aggregation: {
      totalCO2: 126
    }
  }
]

describe('getNextMeasureStartDate', () => {
  beforeEach(() => {
    jest
      .spyOn(global.Date, 'now')
      .mockImplementation(() => new Date('2022-05-12T11:01:58.135Z').valueOf())
  })
  it('should give next start date', () => {
    const startMonth = new Date('2022-01-01T00:00:00')
    expect(dacc.getNextMeasureStartDate(startMonth)).toEqual(
      new Date('2022-02-01T00:00:00')
    )
    const middleMonth = new Date('2022-01-15T00:00:00')
    expect(dacc.getNextMeasureStartDate(middleMonth)).toEqual(
      new Date('2022-02-01T00:00:00')
    )
    const endMonth = new Date('2022-01-31T00:00:00')
    expect(dacc.getNextMeasureStartDate(endMonth)).toEqual(
      new Date('2022-02-01T00:00:00')
    )
  })

  it('should return null when date is after start of current month', async () => {
    jest
      .spyOn(global.Date, 'now')
      .mockImplementation(() => new Date(mockedCurrentDate).valueOf())

    const afterMonth = new Date('2022-05-01')
    expect(dacc.getNextMeasureStartDate(afterMonth)).toBe(null)

    const sameMonth = new Date('2022-04-02')
    expect(dacc.getNextMeasureStartDate(sameMonth)).toBe(null)
  })
})

describe('getStartDate', () => {
  beforeEach(() => {
    jest
      .spyOn(mockClient, 'query')
      .mockResolvedValue({ data: [januaryTimeseries[0]] })
  })
  it('should return the date stored in acount when defined', async () => {
    const account = {
      _id: 'my-account',
      data: { lastDACCMeasureStartDate: '2020-12-01' }
    }
    const date = await dacc.getStartDate(mockClient, account)
    expect(date).toEqual(new Date('2020-12-01'))
  })
  it('should return the startdate based on oldest timeserie when no date is on account', async () => {
    const account = {
      _id: 'my-account',
      data: {}
    }
    const date = await dacc.getStartDate(mockClient, account)
    expect(date).toEqual(new Date('2021-12-01'))
  })
})

describe('hasNonAggregatedTimeseries', () => {
  it('should return true when a timeserie does not have aggregation', () => {
    const timeseries = [
      {
        aggregation: { totalCO2: 10 }
      },
      {}
    ]
    expect(dacc.hasNonAggregatedTimeseries(timeseries)).toBe(true)
  })
  it('should return false when all timeseries have aggregation', () => {
    const timeseries = [
      {
        aggregation: { totalCO2: 10 }
      },
      { aggregation: { totalCO2: 310 } }
    ]
    expect(dacc.hasNonAggregatedTimeseries(timeseries)).toBe(false)
  })
})

describe('sendMeasuresForAccount', () => {
  const expectedMeasure = {
    createdBy: 'coachco2',
    measureName: 'co2-emissions-monthly',
    group1: { is_tracemob_expe: true }
  }
  beforeEach(() => {
    jest.resetAllMocks()

    jest.spyOn(mockClient, 'queryAll').mockResolvedValueOnce(januaryTimeseries)
    jest.spyOn(mockClient, 'queryAll').mockResolvedValueOnce(februaryTimeseries)
    jest.spyOn(mockClient, 'queryAll').mockResolvedValueOnce(marchTimeseries)
    jest.spyOn(mockClient, 'save').mockImplementation(jest.fn())
    jest
      .spyOn(global.Date, 'now')
      .mockImplementation(() => new Date(mockedCurrentDate).valueOf())
  })

  it('should send measures for all the months before current date', async () => {
    const account = {
      _id: 'account-id',
      data: {
        lastDACCMeasureStartDate: '2021-12-01'
      }
    }
    await dacc.sendMeasuresForAccount(mockClient, account)
    // Send for january, february and march
    expect(sendMeasureToDACC).toHaveBeenCalledTimes(3)
    expect(sendMeasureToDACC).toHaveBeenNthCalledWith(
      1,
      mockClient,
      DACC_REMOTE_DOCTYPE,
      {
        ...expectedMeasure,
        value: 39,
        startDate: '2022-01-01'
      }
    )
    expect(sendMeasureToDACC).toHaveBeenNthCalledWith(
      2,
      mockClient,
      DACC_REMOTE_DOCTYPE,
      {
        ...expectedMeasure,
        value: 53,
        startDate: '2022-02-01'
      }
    )
    expect(sendMeasureToDACC).toHaveBeenNthCalledWith(
      3,
      mockClient,
      DACC_REMOTE_DOCTYPE,
      {
        ...expectedMeasure,
        value: 126,
        startDate: '2022-03-01'
      }
    )
  })

  it('should send measures even if date is not in account', async () => {
    const account = {
      _id: 'account-id',
      data: {}
    }
    jest
      .spyOn(mockClient, 'query')
      .mockResolvedValue({ data: [januaryTimeseries[0]] })
    await dacc.sendMeasuresForAccount(mockClient, account)
    expect(sendMeasureToDACC).toHaveBeenCalledTimes(3)
  })

  it('should not send measure if date is after current date', async () => {
    const account = {
      _id: 'account-id',
      data: {
        lastDACCMeasureStartDate: '2022-05-01'
      }
    }
    await dacc.sendMeasuresForAccount(mockClient, account)
    expect(sendMeasureToDACC).toHaveBeenCalledTimes(0)
  })

  it('should not send measure if date is in current month', async () => {
    const account = {
      _id: 'account-id',
      data: {
        lastDACCMeasureStartDate: '2022-04-01'
      }
    }
    await dacc.sendMeasuresForAccount(mockClient, account)
    expect(sendMeasureToDACC).toHaveBeenCalledTimes(0)
  })

  it('should save the last processed date', async () => {
    const account = {
      _id: 'account-id',
      data: {
        lastDACCMeasureStartDate: '2021-12-01'
      }
    }
    const expectedSavedAccount = {
      _id: 'account-id',
      data: {
        lastDACCMeasureStartDate: new Date('2022-03-01')
      }
    }
    await dacc.sendMeasuresForAccount(mockClient, account)
    expect(sendMeasureToDACC).toHaveBeenCalledTimes(3)
    expect(mockClient.save).toHaveBeenCalledWith(expectedSavedAccount)
  })
})

describe('runDACCService', () => {
  beforeEach(() => {
    jest.resetAllMocks()

    jest.spyOn(mockClient, 'save').mockImplementation(jest.fn())
    jest
      .spyOn(global.Date, 'now')
      .mockImplementation(() => new Date(mockedCurrentDate).valueOf())
  })

  it('should do nothing when there is no consent', async () => {
    jest.spyOn(mockClient, 'queryAll').mockResolvedValueOnce(null)
    let shouldRestart = await dacc.runDACCService(mockClient)
    expect(sendMeasureToDACC).toHaveBeenCalledTimes(0)
    expect(shouldRestart).toBe(false)

    jest
      .spyOn(mockClient, 'queryAll')
      .mockResolvedValueOnce([{ allowSendDataToDacc: false }])
    shouldRestart = await dacc.runDACCService(mockClient)
    expect(sendMeasureToDACC).toHaveBeenCalledTimes(0)
    expect(shouldRestart).toBe(false)
  })

  it('should return false when there is no more measure to send', async () => {
    jest
      .spyOn(mockClient, 'queryAll')
      .mockResolvedValueOnce([{ allowSendDataToDacc: true }])
    jest
      .spyOn(mockClient, 'queryAll')
      .mockResolvedValueOnce([
        { _id: 'my-account1', data: { lastDACCMeasureStartDate: '2022-01-01' } }
      ])

    jest
      .spyOn(mockClient, 'queryAll')
      .mockResolvedValue([{ aggregation: { totalCO2: 0 } }])
    const shouldRestart = await dacc.runDACCService(mockClient)
    expect(sendMeasureToDACC).toHaveBeenCalledTimes(2)
    expect(shouldRestart).toBe(false)
  })

  it('should return true when there are no more measure to send', async () => {
    jest
      .spyOn(mockClient, 'queryAll')
      .mockResolvedValueOnce([{ allowSendDataToDacc: true }])
    jest
      .spyOn(mockClient, 'queryAll')
      .mockResolvedValueOnce([
        { _id: 'my-account1', data: { lastDACCMeasureStartDate: '2021-01-01' } }
      ])
    jest
      .spyOn(mockClient, 'queryAll')
      .mockResolvedValue([{ aggregation: { totalCO2: 0 } }])

    const shouldRestart = await dacc.runDACCService(mockClient)
    expect(sendMeasureToDACC).toHaveBeenCalledTimes(12)
    expect(shouldRestart).toBe(true)
  })
})

describe('fetchMonthlyAverageCO2FromDACCFor11Month', () => {
  beforeEach(() => {
    MockDate.set(mockedCurrentDate)
  })

  afterEach(() => {
    MockDate.reset()
  })
  it('should call fetchAggregatesFromDACC with the correct args', async () => {
    dacc.fetchMonthlyAverageCO2FromDACCFor11Month(mockClient)
    expect(fetchAggregatesFromDACC).toHaveBeenCalledWith(
      mockClient,
      DACC_REMOTE_DOCTYPE,
      { measureName: DACC_MEASURE_NAME_CO2_MONTHLY, startDate: '2021-05-01' }
    )
  })
})
