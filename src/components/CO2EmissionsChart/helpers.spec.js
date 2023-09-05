import MockDate from 'mockdate'
import { mockF, mockT } from 'test/lib/I18n'

import { makeData } from './helpers'

const theme = {
  palette: {
    border: { main: '#fff' },
    primary: { main: '#000' }
  }
}

describe('makeData', () => {
  beforeEach(() => {
    MockDate.set('2022-11-01')
  })

  afterEach(() => {
    MockDate.reset()
  })

  describe('sendToDACC is false', () => {
    it('should return well formated data', () => {
      const data = makeData({
        theme,
        oneYearOldTimeseries: [
          { startDate: '2022-10-08T00:00:00.000Z' },
          { startDate: '2022-10-07T00:00:00.000Z' },
          { startDate: '2022-09-08T00:00:00.000Z' }
        ],
        sendToDACC: false,
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
      expect(data.datasets[0].backgroundColor).toBe('#000')
    })
  })

  describe('sendToDACC is true', () => {
    it('should return well formated data', () => {
      const data = makeData({
        theme,
        oneYearOldTimeseries: [
          { startDate: '2022-10-08T00:00:00.000Z' },
          { startDate: '2022-10-07T00:00:00.000Z' },
          { startDate: '2022-09-08T00:00:00.000Z' }
        ],
        sendToDACC: true,
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
      expect(data.datasets[0].backgroundColor).toBe('#000')
      expect(data.datasets[1].backgroundColor).toBe('rgba(0, 0, 0, 0.24)')
    })
  })
})
