import { getOpenPathAccountName } from './helpers'

jest.mock('cozy-harvest-lib/dist/models/ConnectionFlow', () => {
  return {
    default: jest.fn()
  }
})

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
