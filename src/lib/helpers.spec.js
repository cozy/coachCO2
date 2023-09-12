import { computeFormatedPercentage } from 'src/lib/helpers'

describe('Lib helpers', () => {
  describe('computeFormatedPercentage', () => {
    it.each`
      value | total  | result
      ${50} | ${100} | ${'50%'}
      ${50} | ${90}  | ${'55.56%'}
      ${50} | ${80}  | ${'62.50%'}
      ${50} | ${0}   | ${'0%'}
      ${0}  | ${0}   | ${'0%'}
      ${0}  | ${100} | ${'0%'}
    `(
      `should return $result with ($value, $total) params`,
      ({ value, total, result }) => {
        expect(computeFormatedPercentage(value, total)).toBe(result)
      }
    )
  })
})
