import { toPercentage } from './helpers'

describe('toPercentage', () => {
  it('should accept integers between 0 and 100', () => {
    expect(toPercentage(6)).toBe(6)
    expect(toPercentage(94)).toBe(94)
  })

  it('should reject values not between 0 and 100', () => {
    expect(toPercentage(-5)).toBe(null)
    expect(toPercentage(105)).toBe(null)
  })

  it('should round', () => {
    expect(toPercentage(0.6)).toBe(1)
    expect(toPercentage(99.4)).toBe(99)
  })
})
