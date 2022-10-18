import {
  COMMUTE_PURPOSE,
  HOME_PURPOSE,
  OTHER_PURPOSE,
  SCHOOL_PURPOSE,
  SHOPPING_PURPOSE,
  WORK_PURPOSE
} from 'src/constants'
import { computeFormatedPercentage, makeCommutePurpose } from 'src/lib/helpers'

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
  describe('makeCommutePurpose', () => {
    it.each`
      purpose             | result
      ${HOME_PURPOSE}     | ${COMMUTE_PURPOSE}
      ${WORK_PURPOSE}     | ${COMMUTE_PURPOSE}
      ${COMMUTE_PURPOSE}  | ${COMMUTE_PURPOSE}
      ${SHOPPING_PURPOSE} | ${SHOPPING_PURPOSE}
      ${SCHOOL_PURPOSE}   | ${SCHOOL_PURPOSE}
      ${OTHER_PURPOSE}    | ${OTHER_PURPOSE}
    `(
      `should return $result purpose with $purpose param`,
      ({ purpose, result }) => {
        expect(makeCommutePurpose(purpose)).toBe(result)
      }
    )
  })
})
