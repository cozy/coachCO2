import get from 'lodash/get'
import locales from 'src/locales/en.json'

import {
  getLabelByType,
  addAddressToContact,
  getContactAddressAndIndexFromRelationships,
  getPlaceLabelByContact
} from './helpers'

const t = x => get(locales, x)

describe('getLabelByType', () => {
  it('shoud return type of matched contact address', () => {
    const label = getLabelByType({
      contact: { address: [{ id: '123', type: 'Work' }] },
      timeserie: {
        relationships: {
          startPlaceContact: { data: { metadata: { addressId: '123' } } }
        }
      },
      type: 'start'
    })

    expect(label).toBe('Work')
  })

  it('shoud return undefined if no type in matched contact address', () => {
    const label = getLabelByType({
      contact: { address: [{ id: '123' }] },
      timeserie: {
        relationships: {
          startPlaceContact: { data: { metadata: { addressId: '123' } } }
        }
      },
      type: 'start'
    })

    expect(label).toBeUndefined()
  })

  it('shoud return undefined if no contact address matches', () => {
    const label = getLabelByType({
      contact: { address: [{ id: '456' }] },
      timeserie: {
        relationships: {
          startPlaceContact: { data: { metadata: { addressId: '123' } } }
        }
      },
      type: 'start'
    })

    expect(label).toBeUndefined()
  })
})

describe('addAddressToContact', () => {
  it('should add address to existing ones', () => {
    const newContact = addAddressToContact({
      contact: { _id: 'contactId', address: [{ id: 'addressOne' }] },
      addressId: '123',
      label: 'Work',
      category: 'work',
      timeserie: {
        aggregation: { startPlaceDisplayName: 'StartPlace' },
        series: [{ properties: { start_loc: { coordinates: ['02', '48'] } } }]
      },
      t,
      type: 'start'
    })

    expect(newContact).toStrictEqual({
      _id: 'contactId',
      address: [
        { id: 'addressOne' },
        {
          id: '123',
          formattedAddress: 'StartPlace',
          geo: { geo: ['02', '48'], cozyCategory: 'work' },
          type: undefined,
          label: 'work'
        }
      ]
    })
  })

  it('should add address even if no address by default', () => {
    const newContact = addAddressToContact({
      contact: { _id: 'contactId' },
      addressId: '123',
      label: 'Work',
      category: 'work',
      timeserie: {
        aggregation: { startPlaceDisplayName: 'StartPlace' },
        series: [{ properties: { start_loc: { coordinates: ['02', '48'] } } }]
      },
      t,
      type: 'start'
    })

    expect(newContact).toStrictEqual({
      _id: 'contactId',
      address: [
        {
          id: '123',
          formattedAddress: 'StartPlace',
          geo: { geo: ['02', '48'], cozyCategory: 'work' },
          type: undefined,
          label: 'work'
        }
      ]
    })
  })
})

describe('getPlaceLabelByContact', () => {
  const type = 'start'

  describe('if contact is myself', () => {
    it('should return `At home`', () => {
      const contact = {
        displayName: 'John Connor',
        me: true,
        address: [{ id: '123', label: 'home', geo: { cozyCategory: 'home' } }]
      }

      const timeserie = {
        startPlaceContact: { data: contact },
        relationships: {
          startPlaceContact: {
            data: { metadata: { addressId: '123' } }
          }
        }
      }

      expect(getPlaceLabelByContact({ timeserie, type, t })).toBe('At home')
    })

    it('should return `Work`', () => {
      const contact = {
        displayName: 'John Connor',
        me: true,
        address: [{ id: '123', label: 'work', geo: { cozyCategory: 'work' } }]
      }

      const timeserie = {
        startPlaceContact: { data: contact },
        relationships: {
          startPlaceContact: {
            data: { metadata: { addressId: '123' } }
          }
        }
      }

      expect(getPlaceLabelByContact({ timeserie, type, t })).toBe('Work')
    })

    it('should return the custom type for home', () => {
      const contact = {
        displayName: 'John Connor',
        me: true,
        address: [
          {
            id: '123',
            type: 'custom',
            label: 'home',
            geo: { cozyCategory: 'home' }
          }
        ]
      }

      const timeserie = {
        startPlaceContact: { data: contact },
        relationships: {
          startPlaceContact: {
            data: { metadata: { addressId: '123' } }
          }
        }
      }

      expect(getPlaceLabelByContact({ timeserie, type, t })).toBe('custom')
    })

    it('should return the custom type for work', () => {
      const contact = {
        displayName: 'John Connor',
        me: true,
        address: [
          {
            id: '123',
            type: 'custom',
            label: 'work',
            geo: { cozyCategory: 'work' }
          }
        ]
      }

      const timeserie = {
        startPlaceContact: { data: contact },
        relationships: {
          startPlaceContact: {
            data: { metadata: { addressId: '123' } }
          }
        }
      }

      expect(getPlaceLabelByContact({ timeserie, type, t })).toBe('custom')
    })

    it('should return the display name', () => {
      const contact = {
        displayName: 'John Connor',
        me: true,
        address: [{ id: '123' }]
      }

      const timeserie = {
        startPlaceContact: { data: contact },
        relationships: {
          startPlaceContact: {
            data: { metadata: { addressId: '123' } }
          }
        }
      }

      expect(getPlaceLabelByContact({ timeserie, type, t })).toBe('John Connor')
    })
  })

  describe('if contact is not myself', () => {
    it('should return `At contact name`', () => {
      const contact = {
        displayName: 'Sarah Connor',
        address: [{ id: '123', label: 'home', geo: { cozyCategory: 'home' } }]
      }

      const timeserie = {
        startPlaceContact: { data: contact },
        relationships: {
          startPlaceContact: {
            data: { metadata: { addressId: '123' } }
          }
        }
      }

      expect(getPlaceLabelByContact({ timeserie, type, t })).toBe(
        'Sarah Connor (Home)'
      )
    })

    it('should return contact name and `Work`', () => {
      const contact = {
        displayName: 'Sarah Connor',
        address: [{ id: '123', label: 'work', geo: { cozyCategory: 'work' } }]
      }

      const timeserie = {
        startPlaceContact: { data: contact },
        relationships: {
          startPlaceContact: {
            data: { metadata: { addressId: '123' } }
          }
        }
      }

      expect(getPlaceLabelByContact({ timeserie, type, t })).toBe(
        'Sarah Connor (Work)'
      )
    })

    it('should contact name and type for home', () => {
      const contact = {
        displayName: 'Sarah Connor',
        address: [
          {
            id: '123',
            type: 'custom',
            label: 'home',
            geo: { cozyCategory: 'home' }
          }
        ]
      }

      const timeserie = {
        startPlaceContact: { data: contact },
        relationships: {
          startPlaceContact: {
            data: { metadata: { addressId: '123' } }
          }
        }
      }

      expect(getPlaceLabelByContact({ timeserie, type, t })).toBe(
        'Sarah Connor (custom)'
      )
    })

    it('should contact name and type for work', () => {
      const contact = {
        displayName: 'Sarah Connor',
        address: [
          {
            id: '123',
            type: 'custom',
            label: 'work',
            geo: { cozyCategory: 'work' }
          }
        ]
      }

      const timeserie = {
        startPlaceContact: { data: contact },
        relationships: {
          startPlaceContact: {
            data: { metadata: { addressId: '123' } }
          }
        }
      }

      expect(getPlaceLabelByContact({ timeserie, type, t })).toBe(
        'Sarah Connor (custom)'
      )
    })

    it('should return contact name', () => {
      const contact = {
        displayName: 'Sarah Connor',
        address: [{ id: '123' }]
      }

      const timeserie = {
        startPlaceContact: { data: contact },
        relationships: {
          startPlaceContact: {
            data: { metadata: { addressId: '123' } }
          }
        }
      }

      expect(getPlaceLabelByContact({ timeserie, type, t })).toBe(
        'Sarah Connor'
      )
    })
  })

  it('should return null if no contact', () => {
    const timeserie = {
      startPlaceContact: {},
      relationships: {
        startPlaceContact: {}
      }
    }

    expect(getPlaceLabelByContact({ timeserie, type, t })).toBe(null)
  })
})

describe('getContactAddressAndIndexFromRelationships', () => {
  const type = 'start'

  describe('should return undefined', () => {
    it('if no address in contact', () => {
      const res = getContactAddressAndIndexFromRelationships({
        contact: {},
        timeserie: { relationships: { startPlaceContact: {} } },
        type
      })

      expect(res).toStrictEqual({ address: undefined, index: -1 })
    })

    it('if no relationships', () => {
      const res = getContactAddressAndIndexFromRelationships({
        contact: { address: [{ street: 'Baker Street' }] },
        timeserie: { relationships: { startPlaceContact: {} } },
        type
      })

      expect(res).toStrictEqual({ address: undefined, index: -1 })
    })

    it('if no relationships data', () => {
      const res = getContactAddressAndIndexFromRelationships({
        contact: { address: [{ street: 'Baker Street' }] },
        timeserie: { relationships: { startPlaceContact: { data: {} } } },
        type
      })

      expect(res).toStrictEqual({ address: undefined, index: -1 })
    })

    it('if contact address id but no relationships', () => {
      const res = getContactAddressAndIndexFromRelationships({
        contact: { address: [{ id: '123', street: 'Baker Street' }] },
        timeserie: { relationships: { startPlaceContact: {} } },
        type
      })

      expect(res).toStrictEqual({ address: undefined, index: -1 })
    })

    it('if not the same address id', () => {
      const res = getContactAddressAndIndexFromRelationships({
        contact: { address: [{ id: '123', street: 'Baker Street' }] },
        timeserie: {
          relationships: {
            startPlaceContact: { data: { metadata: { addressId: '456' } } }
          }
        },
        type
      })

      expect(res).toStrictEqual({ address: undefined, index: -1 })
    })

    it('if no id on contact address', () => {
      const res = getContactAddressAndIndexFromRelationships({
        contact: { address: [{ street: 'Baker Street' }] },
        timeserie: {
          relationships: {
            startPlaceContact: { data: { metadata: { addressId: '123' } } }
          }
        },
        type
      })

      expect(res).toStrictEqual({ address: undefined, index: -1 })
    })

    it('if contact address is empty array', () => {
      const res = getContactAddressAndIndexFromRelationships({
        contact: { address: [] },
        timeserie: {
          relationships: {
            startPlaceContact: { data: { metadata: { addressId: '123' } } }
          }
        },
        type
      })

      expect(res).toStrictEqual({ address: undefined, index: -1 })
    })
  })

  it('should return the correct address and index', () => {
    const res = getContactAddressAndIndexFromRelationships({
      contact: { address: [{ id: '123', street: 'Baker Street' }] },
      timeserie: {
        relationships: {
          startPlaceContact: { data: { metadata: { addressId: '123' } } }
        }
      },
      type
    })

    expect(res).toStrictEqual({
      address: { id: '123', street: 'Baker Street' },
      index: 0
    })
  })

  it('should return the correct address and index if there is multiple addresses', () => {
    const res = getContactAddressAndIndexFromRelationships({
      contact: {
        address: [
          { id: '123', street: 'Baker Street' },
          { id: '456', street: 'Cooker Street' }
        ]
      },
      timeserie: {
        relationships: {
          startPlaceContact: { data: { metadata: { addressId: '456' } } }
        }
      },
      type
    })

    expect(res).toStrictEqual({
      address: { id: '456', street: 'Cooker Street' },
      index: 1
    })
  })
})
