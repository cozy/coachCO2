/* eslint-disable react/display-name */

import React from 'react'
import { render } from '@testing-library/react'
import { useParams } from 'react-router-dom'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import {
  sortTimeseriesByCO2GroupedByMode,
  computeCO2Timeseries,
  transformTimeseriesToTrips
} from 'src/lib/timeseries'
import { makeChartProps } from 'src/components/Analysis/helpers'
import LoadedModesList from 'src/components/Analysis/Modes/LoadedModesList'

jest.mock('src/components/TripsList', () => () => (
  <div data-testid="TripsList" />
))
jest.mock('react-router-dom', () => ({
  useParams: jest.fn().mockReturnValue(() => ({ purpose: '', mode: '' }))
}))
jest.mock('src/components/Analysis/helpers')
jest.mock('src/lib/timeseries')
jest.mock('cozy-ui/transpiled/react/hooks/useBreakpoints', () => () => ({
  isMobile: false
}))
jest.mock('cozy-ui/transpiled/react/I18n')
jest.mock(
  'src/components/Analysis/AnalysisListItem',
  () =>
    ({ type, sortedTimeserie, totalCO2 }) =>
      (
        <div
          data-testid="AnalysisListItem"
          data-test-type={type}
          data-timeserie={sortedTimeserie}
          data-total={totalCO2}
        />
      )
)
jest.mock(
  'cozy-ui/transpiled/react/PieChart',
  () =>
    ({ data, options, primaryText, secondaryText }) =>
      (
        <div
          data-testid="PieChart"
          data-test={data}
          data-options={options}
          data-primarytext={primaryText}
          data-secondarytext={secondaryText}
        />
      )
)

describe('LoadedModesList', () => {
  const timeseries = ['timeseries']
  const t = x => x
  const firstTimeserieSortedByMode = {
    timeseries: [],
    totalCO2: 22
  }
  const timeseriesSortedByMode = {
    firstTimeserieSortedByMode,
    CAR: {
      timeseries: [],
      totalCO2: 23
    }
  }

  beforeEach(() => {
    useI18n.mockReturnValue({ t })
    sortTimeseriesByCO2GroupedByMode.mockReturnValue(timeseriesSortedByMode)
    computeCO2Timeseries.mockReturnValue(48)
    makeChartProps.mockReturnValue({ data: 'data', options: 'options' })
  })

  it('should contain a AnalysisListItem with correct timeseriesSortedByMode and total CO2', () => {
    const { getAllByTestId } = render(<LoadedModesList />)

    expect(
      getAllByTestId('AnalysisListItem')[0].getAttribute('data-test-type')
    ).toEqual('modes')
    expect(
      getAllByTestId('AnalysisListItem')[0].getAttribute('data-timeserie')
    ).toEqual('firstTimeserieSortedByMode,[object Object]')
    expect(
      getAllByTestId('AnalysisListItem')[0].getAttribute('data-total')
    ).toEqual('48')
  })

  it('should contain a PieChart with correct total CO2', () => {
    const { getByTestId } = render(<LoadedModesList />)

    expect(getByTestId('PieChart').getAttribute('data-secondarytext')).toEqual(
      'analysis.emittedCO2'
    )
    expect(getByTestId('PieChart').getAttribute('data-options')).toEqual(
      'options'
    )
    expect(getByTestId('PieChart').getAttribute('data-test')).toEqual('data')
    expect(getByTestId('PieChart').getAttribute('data-primarytext')).toEqual(
      '48 kg'
    )
  })

  it('should sortTimeseriesByCO2GroupedByMode from timeseries', () => {
    render(<LoadedModesList timeseries={timeseries} />)

    expect(sortTimeseriesByCO2GroupedByMode).toHaveBeenCalledWith(timeseries)
  })

  it('should computeCO2Timeseries from timeseries', () => {
    render(<LoadedModesList timeseries={timeseries} />)

    expect(computeCO2Timeseries).toHaveBeenCalledWith(timeseries)
  })

  it('should makeChartProps from timeseries', () => {
    render(<LoadedModesList timeseries={timeseries} />)

    expect(makeChartProps).toHaveBeenCalledWith(
      {
        CAR: { timeseries: [], totalCO2: 23 },
        firstTimeserieSortedByMode: { timeseries: [], totalCO2: 22 }
      },
      'modes',
      t
    )
  })

  it('should render TripsList if "mode" param is defined', () => {
    useParams.mockReturnValue({ mode: 'CAR' })
    transformTimeseriesToTrips.mockReturnValue([])
    const { queryByTestId } = render(
      <LoadedModesList timeseries={timeseries} />
    )
    expect(queryByTestId('TripsList')).toBeTruthy()
    expect(queryByTestId('PieChart')).not.toBeTruthy()
    expect(queryByTestId('AnalysisListItem')).not.toBeTruthy()
  })

  it('should render AnalysisListItem & PieChart if "mode" param is undefined', () => {
    useParams.mockReturnValue({ mode: '' })
    transformTimeseriesToTrips.mockReturnValue([])
    const { queryByTestId, queryAllByTestId } = render(
      <LoadedModesList timeseries={timeseries} />
    )
    expect(queryByTestId('PieChart')).toBeTruthy()
    expect(queryAllByTestId('AnalysisListItem')).toBeTruthy()
    expect(queryByTestId('TripsList')).not.toBeTruthy()
  })
})
