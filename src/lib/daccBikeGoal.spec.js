import { APP_SLUG, DACC_MEASURE_NAME_BIKE_GOAL } from 'src/constants'
import { DACC_REMOTE_DOCTYPE } from 'src/doctypes'

import { createMockClient, models } from 'cozy-client'
import flag from 'cozy-flags'
const { sendMeasureToDACC } = models.dacc

import * as dacc from './daccBikeGoal'

jest.mock('cozy-flags')

jest.mock('cozy-client', () => ({
  ...jest.requireActual('cozy-client'),
  models: {
    dacc: {
      sendMeasureToDACC: jest.fn()
    },
    geo: { geodesicDistance: jest.fn() }
  }
}))

const mockClient = createMockClient({})
const mockAccount = {
  _id: 'my-account'
}
const mockedCurrentDate = '2022-04-12T11:01:58.135Z'
const currentDay = mockedCurrentDate.split('T')[0]

const bikeCommuteTimeseries = [
  {
    startDate: '2022-01-01'
  },
  {
    startDate: '2022-01-01'
  },
  {
    startDate: '2022-03-01'
  }
]

describe('getBikeGroupName', () => {
  it('gets the flag source name when defined', async () => {
    flag.mockReturnValue({ sourceName: 'The Great Group' })
    const group = await dacc.getBikeGroupName(mockClient)
    expect(group).toEqual('The Great Group')
  })
  it('fallbacks on unknown when source name is not defined', async () => {
    flag.mockReturnValue({})
    const group1 = await dacc.getBikeGroupName(mockClient)
    expect(group1).toEqual('unknown')

    flag.mockReturnValue({ sourceName: '' })
    const group2 = await dacc.getBikeGroupName(mockClient)
    expect(group2).toEqual('unknown')
  })
})

describe('sendBikeGoalMeasuresForAccount', () => {
  beforeEach(() => {
    jest.useFakeTimers('modern')
    jest.setSystemTime(new Date(mockedCurrentDate))
    jest
      .spyOn(mockClient, 'queryAll')
      .mockResolvedValueOnce(bikeCommuteTimeseries)
  })
  afterEach(() => {
    jest.useRealTimers()
  })
  it('should send the correct number of bike commute in the year', async () => {
    const expectedMeasure = {
      createdBy: APP_SLUG,
      startDate: currentDay,
      value: 2,
      measureName: DACC_MEASURE_NAME_BIKE_GOAL,
      groups: [{ groupName: 'Cozy' }]
    }
    flag.mockReturnValue({ sourceName: 'Cozy' })

    await dacc.sendBikeGoalMeasuresForAccount(mockClient, mockAccount)
    expect(sendMeasureToDACC).toHaveBeenCalledWith(
      mockClient,
      DACC_REMOTE_DOCTYPE,
      expectedMeasure
    )
  })
})

describe('getAvgForGroupName', () => {
  it('should get the avg value for the given group', () => {
    const aggs = [
      {
        avg: 4.544,
        groups: [{ groupName: 'Cozy' }]
      },
      {
        avg: 2.32,
        groups: [{ groupName: 'Hyperion' }]
      }
    ]
    flag.mockReturnValue({ sourceName: 'Cozy' })
    expect(dacc.getAvgDaysForGroupName(aggs, 'Cozy')).toEqual(5)
  })
  it('should return null when the given group is not found', () => {
    const aggs = [
      {
        avg: 4.544,
        groups: [{ groupName: 'Cozy' }]
      }
    ]
    flag.mockReturnValue({ sourceName: 'Hyperion' })
    expect(dacc.getAvgDaysForGroupName(aggs, 'Hyperion')).toEqual(null)
  })
})
