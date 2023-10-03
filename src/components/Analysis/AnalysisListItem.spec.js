import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import AnalysisListItem from 'src/components/Analysis/AnalysisListItem'
import AppLike from 'test/AppLike'

const navigate = x => {
  // eslint-disable-next-line no-console
  console.log('navigate is called')
  return x
}

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn().mockReturnValue(navigate)
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
    useNavigate.mockReturnValue(navigate)

    fireEvent.click(getByTestId('ListItem'))

    // eslint-disable-next-line no-console
    expect(console.log).toHaveBeenCalledWith('navigate is called')
  })

  it('should return null if disabled', () => {
    const { queryByTestId } = setup()

    expect(queryByTestId('ListItem')).toBeNull()
  })
})
