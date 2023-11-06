import {
  makeQueriesByAccountsId,
  makeWelcomeText
} from 'src/components/EmptyContent/helpers.js'

import flag from 'cozy-flags'

jest.mock('cozy-flags')

const setupFlags = flags => flag.mockImplementation(flagName => flags[flagName])

describe('makeQueriesByAccountsId', () => {
  it('should create well formatted object', () => {
    const res = makeQueriesByAccountsId([{ _id: 'id1' }, { _id: 'id2' }])

    expect(res).toMatchObject({
      id1: {
        as: expect.any(String),
        fetchPolicy: expect.any(Function),
        query: expect.any(Object)
      },
      id2: {
        as: expect.any(String),
        fetchPolicy: expect.any(Function),
        query: expect.any(Object)
      }
    })
  })
})

describe('makeWelcomeText', () => {
  it('should return text for maxDaysToCapture undefined', () => {
    setupFlags({
      'coachco2.max-days-to-capture': undefined,
      'coachco2.bikegoal.enabled': true
    })

    expect(makeWelcomeText()).toBe('text')
  })

  it('should return text for maxDaysToCapture undefined even if bikegoal disabled', () => {
    setupFlags({
      'coachco2.max-days-to-capture': undefined,
      'coachco2.bikegoal.enabled': false
    })

    expect(makeWelcomeText()).toBe('text')
  })

  it('should return text for maxDaysToCapture undefined even if bikegoal undefined', () => {
    setupFlags({
      'coachco2.max-days-to-capture': undefined,
      'coachco2.bikegoal.enabled': undefined
    })

    expect(makeWelcomeText()).toBe('text')
  })

  it('should return text for maxDaysToCapture null', () => {
    setupFlags({
      'coachco2.max-days-to-capture': null,
      'coachco2.bikegoal.enabled': true
    })

    expect(makeWelcomeText()).toBe('text')
  })

  it('should return text for B2C without option, premium or B2B', () => {
    setupFlags({
      'coachco2.max-days-to-capture': 10,
      'coachco2.bikegoal.enabled': true
    })

    expect(makeWelcomeText()).toBe('textA')
  })

  it('should return text for B2C without option, even for premium', () => {
    setupFlags({
      'coachco2.max-days-to-capture': 10,
      'coachco2.bikegoal.enabled': true,
      'coachco2.bikegoal.settings': { sourceOffer: 'premium' }
    })

    expect(makeWelcomeText()).toBe('textA')
  })

  it('should return text for B2C with premium', () => {
    setupFlags({
      'coachco2.max-days-to-capture': -1,
      'coachco2.bikegoal.enabled': true,
      'coachco2.bikegoal.settings': { sourceOffer: 'premium' }
    })

    expect(makeWelcomeText()).toBe('textB')
  })

  it('should return text for B2C with premium even without sourceOffer', () => {
    setupFlags({
      'coachco2.max-days-to-capture': -1,
      'coachco2.bikegoal.enabled': true,
      'coachco2.bikegoal.settings': { sourceOffer: undefined }
    })

    expect(makeWelcomeText()).toBe('textB')
  })

  it('should return text for B2C with custom sourceOffer ', () => {
    setupFlags({
      'coachco2.max-days-to-capture': -1,
      'coachco2.bikegoal.enabled': true,
      'coachco2.bikegoal.settings': { sourceOffer: 'other' }
    })

    expect(makeWelcomeText()).toBe('text')
  })

  it('should return text for B2B sponsored to constituents', () => {
    setupFlags({
      'coachco2.max-days-to-capture': -1,
      'coachco2.bikegoal.enabled': true,
      'coachco2.bikegoal.settings': {
        sourceOffer: 'otherThanEmployer',
        sourceName: 'notEmpty'
      }
    })

    expect(makeWelcomeText()).toBe('textC')
  })

  it('should return text for other B2B', () => {
    setupFlags({
      'coachco2.max-days-to-capture': -1,
      'coachco2.bikegoal.enabled': true,
      'coachco2.bikegoal.settings': {
        sourceOffer: 'otherThanEmployer'
      }
    })

    expect(makeWelcomeText()).toBe('text')
  })

  it('should return text for B2B sponsored to employees', () => {
    setupFlags({
      'coachco2.max-days-to-capture': -1,
      'coachco2.bikegoal.enabled': true,
      'coachco2.bikegoal.settings': {
        sourceOffer: 'employer'
      }
    })

    expect(makeWelcomeText()).toBe('textD')
  })

  it('should return text for B2B sponsored to employees even with sourceName', () => {
    setupFlags({
      'coachco2.max-days-to-capture': -1,
      'coachco2.bikegoal.enabled': true,
      'coachco2.bikegoal.settings': {
        sourceOffer: 'employer',
        sourceName: 'notEmpty'
      }
    })

    expect(makeWelcomeText()).toBe('textD')
  })
})
