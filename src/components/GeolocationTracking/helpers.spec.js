import { getOpenPathAccountName, enableGeolocationTracking } from './helpers'

const t = () => 'créé le'

describe('getOpenPathAccountName', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return device name if no account exists with device name as login', async () => {
    const client = {
      query: () => ({ data: [] })
    }

    const name = await getOpenPathAccountName({
      client,
      t,
      lang: 'fr-FR',
      deviceName: 'iPhone'
    })
    expect(name).toBe('iPhone')
  })

  it('should return device name with date if accounts exist with device name as login', async () => {
    const client = {
      query: () => ({ data: [{ auth: { login: 'iPhone' } }] })
    }

    const name = await getOpenPathAccountName({
      client,
      t,
      lang: 'fr-FR',
      deviceName: 'iPhone'
    })
    expect(name).toBe(
      `iPhone créé le ${new Date().toLocaleDateString('fr-FR')}`
    )
  })
})

describe('enableGeolocationTracking', () => {
  beforeAll(() => {
    jest.clearAllMocks()
  })

  it('should enable geolocation tracking without creating a new account if there is already a tracking id', async () => {
    const mockWebviewIntentCall = jest.fn()

    const mockWebviewIntent = {
      call: mockWebviewIntentCall
    }

    mockWebviewIntentCall.mockImplementation(methodName => {
      if (methodName === 'getGeolocationTrackingId') {
        return 'ID'
      } else if (methodName === 'getGeolocationTrackingStatus') {
        return { enabled: true }
      }
    })

    await enableGeolocationTracking({
      webviewIntent: mockWebviewIntent,
      setIsGeolocationTrackingEnabled: jest.fn(),
      setIsGeolocationQuotaExceeded: jest.fn()
    })

    expect(mockWebviewIntentCall.mock.calls[0][0]).toBe(
      'getGeolocationTrackingId'
    )
    expect(mockWebviewIntentCall.mock.calls[1][0]).toBe(
      'setGeolocationTracking'
    )
    // expect(mockWebviewIntentCall.mock.calls[2][0]).toBe(
    //   'getGeolocationTrackingStatus'
    // )
  })

  it('should enable geolocation tracking with creating a new account if there is no tracking id', async () => {
    const mockWebviewIntentCall = jest.fn()
    const client = {
      query: () => ({ data: [] }),
      create: () => ({})
    }

    const mockWebviewIntent = {
      call: mockWebviewIntentCall
    }

    mockWebviewIntentCall.mockImplementation(methodName => {
      if (methodName === 'getGeolocationTrackingId') {
        return null
      } else if (methodName === 'getDeviceInfo') {
        return { deviceName: 'iPhone' }
      } else if (methodName === 'getGeolocationTrackingStatus') {
        return { enabled: true }
      }
    })

    await enableGeolocationTracking({
      client,
      t,
      lang: 'fr-FR',
      webviewIntent: mockWebviewIntent,
      setIsGeolocationTrackingEnabled: jest.fn(),
      setIsGeolocationQuotaExceeded: jest.fn()
    })

    expect(mockWebviewIntentCall.mock.calls[0][0]).toBe(
      'getGeolocationTrackingId'
    )
    expect(mockWebviewIntentCall.mock.calls[1][0]).toBe('getDeviceInfo')
    expect(mockWebviewIntentCall.mock.calls[2][0]).toBe(
      'setGeolocationTrackingId'
    )
    expect(mockWebviewIntentCall.mock.calls[3][0]).toBe(
      'setGeolocationTracking'
    )
    // expect(mockWebviewIntentCall.mock.calls[4][0]).toBe(
    //   'getGeolocationTrackingStatus'
    // )
  })
})
