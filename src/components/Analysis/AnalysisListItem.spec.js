import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import { useHistory } from 'react-router-dom'

import AnalysisListItem from 'src/components/Analysis/AnalysisListItem'

const history = {
  push: x => {
    // eslint-disable-next-line no-console
    console.log('history push is called')
    return x
  }
}

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn().mockReturnValue(history)
}))
jest.mock('cozy-ui/transpiled/react/I18n', () => ({
  useI18n: jest.fn(() => ({ t: jest.fn() }))
}))
jest.mock('cozy-ui/transpiled/react/MuiCozyTheme/Divider', () => () => (
  <div data-testid="Divider" />
))
jest.mock(
  'cozy-ui/transpiled/react/MuiCozyTheme/ListItem',
  () => ({ children, disabled, onClick }) => (
    <div data-testid="ListItem" data-test-disabled={disabled} onClick={onClick}>
      {children}
    </div>
  )
)
jest.mock(
  'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon',
  () => ({ children }) => <div data-testid="ListItemIcon">{children}</div>
)
jest.mock(
  'cozy-ui/transpiled/react/ListItemText',
  () => ({ primary, secondary }) => (
    <div data-testid="ListItemText" primary={primary} secondary={secondary} />
  )
)
jest.mock('cozy-ui/transpiled/react/Typography', () => ({ children }) => (
  <div data-testid="Typography">{children}</div>
))

const setup = ({
  key = 'CAR',
  value = { timeseries: [], totalCO2: 0 }
} = {}) => {
  const sortedTimeserie = [key, value]

  return render(<AnalysisListItem sortedTimeserie={sortedTimeserie} />)
}

describe('AnalysisListItem', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation()
  })

  it('should push route', () => {
    const { getByTestId } = setup()
    useHistory.mockReturnValue(history)

    fireEvent.click(getByTestId('ListItem'))

    // eslint-disable-next-line no-console
    expect(console.log).toHaveBeenCalledWith('history push is called')
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
      expect(
        queryByTestId('ListItem').getAttribute('data-test-disabled')
      ).toEqual(`${result}`)
    }
  )
})
