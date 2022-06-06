import MockDate from 'mockdate'

import { makeData } from './helpers'
import { mockF } from 'test/lib/I18n'

const theme = {
  palette: {
    border: { main: 'borderMainColor' },
    primary: { main: 'primaryMainColor' }
  }
}

describe('makeData', () => {
  beforeEach(() => {
    MockDate.set('2022-11-01')
  })

  afterEach(() => {
    MockDate.reset()
  })

  describe('allowSendDataToDacc is false', () => {
    it('should return well formated data', () => {
      const data = makeData({
        theme,
        oneYearOldTimeseries: [
          { startDate: '2022-10-08T00:00:00.000Z' },
          { startDate: '2022-10-07T00:00:00.000Z' },
          { startDate: '2022-09-08T00:00:00.000Z' }
        ],
        allowSendDataToDacc: false,
        f: mockF
      })

      expect(data.labels).toStrictEqual([
        'DEC',
        'JAN',
        'FEB',
        'MAR',
        'APR',
        'MAY',
        'JUN',
        'JUL',
        'AUG',
        'SEP',
        'OCT',
        'NOV'
      ])
      expect(data.datasets[0].backgroundColor).toBe('primaryMainColor')
    })
  })
})
