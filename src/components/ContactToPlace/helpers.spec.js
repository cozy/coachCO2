import { getLabelByType, addAddressToContact } from './helpers'

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
