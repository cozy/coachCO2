import get from 'lodash/get'
import locales from 'src/locales/en.json'

import CompanyIcon from 'cozy-ui/transpiled/react/Icons/Company'
import HomeIcon from 'cozy-ui/transpiled/react/Icons/Home'
import PeopleIcon from 'cozy-ui/transpiled/react/Icons/People'

import {
  getLabelByType,
  addAddressToContact,
  getPlaceLabelByContact,
  getPlaceColorAndIconByContact
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
          type: 'Work'
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
      type: 'start'
    })

    expect(newContact).toStrictEqual({
      _id: 'contactId',
      address: [
        {
          id: '123',
          formattedAddress: 'StartPlace',
          geo: { geo: ['02', '48'], cozyCategory: 'work' },
          type: 'Work'
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
        address: [{ id: '123', type: 'Home', geo: { cozyCategory: 'home' } }]
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
        address: [{ id: '123', type: 'Work', geo: { cozyCategory: 'work' } }]
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

    it('should return the label', () => {
      const contact = {
        displayName: 'John Connor',
        me: true,
        address: [{ id: '123', type: 'custom' }]
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
        address: [{ id: '123', type: 'Home', geo: { cozyCategory: 'home' } }]
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

    it('should return contact name and work', () => {
      const contact = {
        displayName: 'Sarah Connor',
        address: [{ id: '123', type: 'Work', geo: { cozyCategory: 'work' } }]
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

    it('should contact name and label', () => {
      const contact = {
        displayName: 'Sarah Connor',
        address: [{ id: '123', type: 'custom' }]
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

describe('getPlaceColorAndIconByContact', () => {
  const type = 'start'

  describe('if contact is myself', () => {
    it('should return work icon and color', () => {
      const contact = {
        displayName: 'John Connor',
        me: true,
        address: [{ id: '123', type: 'Work', geo: { cozyCategory: 'work' } }]
      }

      const timeserie = {
        startPlaceContact: { data: contact },
        relationships: {
          startPlaceContact: {
            data: { metadata: { addressId: '123' } }
          }
        }
      }

      expect(getPlaceColorAndIconByContact(timeserie, type)).toStrictEqual({
        color: '#BA5AE8',
        Icon: CompanyIcon
      })
    })

    it('should return people icon and color', () => {
      const contact = {
        displayName: 'John Connor',
        me: true,
        address: [{ id: '123', type: 'Custom' }]
      }

      const timeserie = {
        startPlaceContact: { data: contact },
        relationships: {
          startPlaceContact: {
            data: { metadata: { addressId: '123' } }
          }
        }
      }

      expect(getPlaceColorAndIconByContact(timeserie, type)).toStrictEqual({
        color: '#F05759',
        Icon: PeopleIcon
      })
    })

    it('should return home icon and color', () => {
      const contact = {
        displayName: 'John Connor',
        me: true,
        address: [{ id: '123', type: 'Home', geo: { cozyCategory: 'home' } }]
      }

      const timeserie = {
        startPlaceContact: { data: contact },
        relationships: {
          startPlaceContact: {
            data: { metadata: { addressId: '123' } }
          }
        }
      }

      expect(getPlaceColorAndIconByContact(timeserie, type)).toStrictEqual({
        color: '#F1B61E',
        Icon: HomeIcon
      })
    })
  })

  describe('if contact is myself', () => {
    it('should return work icon and color', () => {
      const contact = {
        displayName: 'Sarah Connor',
        address: [{ id: '123', type: 'Work', geo: { cozyCategory: 'work' } }]
      }

      const timeserie = {
        startPlaceContact: { data: contact },
        relationships: {
          startPlaceContact: {
            data: { metadata: { addressId: '123' } }
          }
        }
      }

      expect(getPlaceColorAndIconByContact(timeserie, type)).toStrictEqual({
        color: '#BA5AE8',
        Icon: CompanyIcon
      })
    })

    it('should return people icon and color', () => {
      const contact = {
        displayName: 'Sarah Connor',
        address: [{ id: '123', type: 'Custom' }]
      }

      const timeserie = {
        startPlaceContact: { data: contact },
        relationships: {
          startPlaceContact: {
            data: { metadata: { addressId: '123' } }
          }
        }
      }

      expect(getPlaceColorAndIconByContact(timeserie, type)).toStrictEqual({
        color: '#F05759',
        Icon: PeopleIcon
      })
    })

    it('should return home icon and color', () => {
      const contact = {
        displayName: 'Sarah Connor',
        address: [{ id: '123', type: 'Home', geo: { cozyCategory: 'home' } }]
      }

      const timeserie = {
        startPlaceContact: { data: contact },
        relationships: {
          startPlaceContact: {
            data: { metadata: { addressId: '123' } }
          }
        }
      }

      expect(getPlaceColorAndIconByContact(timeserie, type)).toStrictEqual({
        color: '#F05759',
        Icon: PeopleIcon
      })
    })
  })

  it('should return empty object if no contact', () => {
    const timeserie = {
      startPlaceContact: {},
      relationships: {
        startPlaceContact: {}
      }
    }

    expect(getPlaceColorAndIconByContact(timeserie, type)).toStrictEqual({})
  })
})
