import MockDate from 'mockdate'

import { makeData } from './helpers'
import { mockF, mockT } from 'test/lib/I18n'

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
        globalAverages: null,
        f: mockF,
        t: mockT
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
      expect(data.datasets.length).toEqual(1)
      expect(data.datasets[0].backgroundColor).toBe('primaryMainColor')
    })
  })
  describe('allowSendDataToDacc is true', () => {
    it('should return well formated data', () => {
      const data = makeData({
        theme,
        oneYearOldTimeseries: [
          { startDate: '2022-10-08T00:00:00.000Z' },
          { startDate: '2022-10-07T00:00:00.000Z' },
          { startDate: '2022-09-08T00:00:00.000Z' }
        ],
        allowSendDataToDacc: true,
        globalAverages: [42, 96, 78],
        f: mockF,
        t: mockT
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
      expect(data.datasets.length).toEqual(2)
      expect(data.datasets[0].backgroundColor).toBe('primaryMainColor')
      expect(data.datasets[1].backgroundColor).toBe('borderMainColor')
    })
  })
})
