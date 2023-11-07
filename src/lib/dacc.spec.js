import { createMockClient, models } from 'cozy-client'
jest.mock('cozy-flags')
const { sendMeasureToDACC } = models.dacc

import * as dacc from './dacc'

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
const mockedCurrentDate = '2022-04-12T11:01:58.135Z'

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
      .mockResolvedValueOnce([{ CO2Emission: { sendToDACC: false } }])
    shouldRestart = await dacc.runDACCService(mockClient)
    expect(sendMeasureToDACC).toHaveBeenCalledTimes(0)
    expect(shouldRestart).toBe(false)
  })

  it('should return false when there is no more measure to send', async () => {
    jest
      .spyOn(mockClient, 'queryAll')
      .mockResolvedValueOnce([{ CO2Emission: { sendToDACC: true } }])
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
      .mockResolvedValueOnce([{ CO2Emission: { sendToDACC: true } }])
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
