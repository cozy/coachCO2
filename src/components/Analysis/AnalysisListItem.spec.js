import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import { useHistory } from 'react-router-dom'

import AppLike from 'test/AppLike'
import AnalysisListItem from 'src/components/Analysis/AnalysisListItem'

const history = {
  push: x => {
    // eslint-disable-next-line no-console
    console.log('history push is called')
    return x
  }
}

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn().mockReturnValue(history)
}))

const setup = ({
  key = 'CAR',
  value = { timeseries: [], totalCO2: 0 }
} = {}) => {
  const sortedTimeserie = [key, value]

  return render(
    <AppLike>
      <AnalysisListItem sortedTimeserie={sortedTimeserie} type="modes" />
    </AppLike>
  )
}

describe('AnalysisListItem', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should push route', () => {
    const { getByTestId } = setup({
      value: { timeseries: ['a'], totalCO2: 1 }
    })
    useHistory.mockReturnValue(history)

    fireEvent.click(getByTestId('ListItem'))

    // eslint-disable-next-line no-console
    expect(console.log).toHaveBeenCalledWith('history push is called')
  })

  it('should not push route if disabled', () => {
    const { getByTestId } = setup({
      value: { timeseries: [], totalCO2: 0 }
    })
    useHistory.mockReturnValue(history)

    fireEvent.click(getByTestId('ListItem'))

    // eslint-disable-next-line no-console
    expect(console.log).not.toHaveBeenCalledWith('history push is called')
  })

  it.each`
    timeseries | totalCO2 | result
    ${[]}      | ${0}     | ${true}
    ${['a']}   | ${0}     | ${false}
    ${[]}      | ${1}     | ${false}
    ${['a']}   | ${1}     | ${false}
  `(
    `should set "disabled" to $result if the parameters "timeseries" = $timeseries & "totalCO2" = $totalCO2`,
    ({ timeseries, totalCO2, result }) => {
      const { queryByTestId } = setup({
        value: { timeseries, totalCO2 }
      })
      expect(queryByTestId('ListItem').getAttribute('aria-disabled')).toEqual(
        `${result}`
      )
    }
  )
})
