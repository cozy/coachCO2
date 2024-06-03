import { findMatchingStartAndEnd } from './contacts'
import { mockTimeserie } from './recurringPurposes.spec.js'

describe('findStartAndEnd', () => {
  it('should return empty objects when no contacts are found', () => {
    const ts = mockTimeserie({
      startCoordinates: [-3.01, 6.9],
      endCoordinates: [19.9, 20.01]
    })
    const { matchingStart, matchingEnd } = findMatchingStartAndEnd(ts, [])
    expect(matchingStart).toEqual(null)
    expect(matchingEnd).toEqual(null)
  })

  it('should not consider addresses without geo info', () => {
    const mockContact = [
      {
        name: 'toto',
        address: [
          {
            id: 1
          }
        ]
      }
    ]
    const { matchingStart, matchingEnd } = findMatchingStartAndEnd(
      {},
      mockContact
    )
    expect(matchingStart).toEqual(null)
    expect(matchingEnd).toEqual(null)
  })

  it('should find the exact matching start and end places', () => {
    const ts = mockTimeserie({
      startCoordinates: [-3, 7],
      endCoordinates: [20, 20]
    })
    const mockContacts = [
      {
        name: 'toto',
        address: [
          {
            id: 1,
            geo: {
              geo: [20, 20]
            }
          }
        ]
      },
      {
        name: 'tutu',
        address: [
          {
            id: 2,
            geo: {
              geo: [46, 1]
            }
          },
          {
            id: 3,
            geo: {
              geo: [-3, 7]
            }
          }
        ]
      }
    ]
    const { matchingStart, matchingEnd } = findMatchingStartAndEnd(
      ts,
      mockContacts
    )
    expect(matchingStart.contact).toEqual(mockContacts[1])
    expect(matchingStart.address).toEqual(mockContacts[1].address[1])

    expect(matchingEnd.contact).toEqual(mockContacts[0])
    expect(matchingEnd.address).toEqual(mockContacts[0].address[0])
  })
  it('should find the close matching start and end places', () => {
    const ts = mockTimeserie({
      startCoordinates: [45.999, 1.001],
      endCoordinates: [20.001, 19.999]
    })
    const mockContacts = [
      {
        name: 'toto',
        address: [
          {
            id: 1,
            geo: {
              geo: [20, 20]
            }
          }
        ]
      },
      {
        name: 'tutu',
        address: [
          {
            id: 2,
            geo: {
              geo: [46, 1]
            }
          }
        ]
      }
    ]
    const { matchingStart, matchingEnd } = findMatchingStartAndEnd(
      ts,
      mockContacts
    )
    expect(matchingStart.contact).toEqual(mockContacts[1])
    expect(matchingStart.address).toEqual(mockContacts[1].address[0])

    expect(matchingEnd.contact).toEqual(mockContacts[0])
    expect(matchingEnd.address).toEqual(mockContacts[0].address[0])
  })
})
