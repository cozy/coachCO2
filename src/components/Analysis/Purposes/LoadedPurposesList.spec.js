import React from 'react'
import { render } from '@testing-library/react'
import LoadedPurposesList from './LoadedPurposesList'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import {
  computeAggregatedTimeseries,
  sortTimeseriesByCO2GroupedByPurpose,
  computeCO2Timeseries
} from 'src/lib/timeseries'
import { makeChartProps } from 'src/components/Analysis/helpers'

jest.mock('src/components/Analysis/helpers')
jest.mock('src/lib/timeseries')
jest.mock('cozy-ui/transpiled/react/hooks/useBreakpoints', () => () => ({
  isMobile: false
}))
jest.mock('cozy-ui/transpiled/react/I18n')
jest.mock(
  'src/components/Analysis/AnalysisListItem',
  () => ({ type, sortedTimeserie, totalCO2 }) => (
    <div
      data-testid="AnalysisListItem"
      data-test-type={type}
      data-timeserie={sortedTimeserie}
      data-total={totalCO2}
    />
  )
)
jest.mock(
  'src/components/PieChart/PieChart',
  () => ({ data, options, total, label }) => (
    <div
      data-testid="PieChart"
      data-test={data}
      data-options={options}
      data-total={total}
      data-label={label}
    />
  )
)

describe('LoadedPurposesList', () => {
  const timeseries = ['timeseries']
  const aggregatedTimeseries = 'computeAggregatedTimeseries'
  const t = x => x
  const firstTimeserieSortedByPurposes = {
    timeseries: [],
    totalCO2: 22
  }
  const timeseriesSortedByPurposes = {
    firstTimeserieSortedByPurposes,
    WORK: {
      timeseries: [],
      totalCO2: 23
    }
  }

  beforeEach(() => {
    useI18n.mockReturnValue({ t })
    computeAggregatedTimeseries.mockReturnValue(aggregatedTimeseries)
    sortTimeseriesByCO2GroupedByPurpose.mockReturnValue(
      timeseriesSortedByPurposes
    )
    computeCO2Timeseries.mockReturnValue(48)
    makeChartProps.mockReturnValue({ data: 'data', options: 'options' })
    jest.clearAllMocks()
  })

  it('should contain a AnalysisListItem with correct timeseriesSortedByPurposes and total CO2', () => {
    const { getAllByTestId } = render(<LoadedPurposesList />)

    expect(
      getAllByTestId('AnalysisListItem')[0].getAttribute('data-test-type')
    ).toEqual('purposes')
    expect(
      getAllByTestId('AnalysisListItem')[0].getAttribute('data-timeserie')
    ).toEqual('firstTimeserieSortedByPurposes,[object Object]')
    expect(
      getAllByTestId('AnalysisListItem')[0].getAttribute('data-total')
    ).toEqual('48')
  })

  it('should contain a PieChart with correct total CO2', () => {
    const { getByTestId } = render(<LoadedPurposesList />)

    expect(getByTestId('PieChart').getAttribute('data-label')).toEqual(
      'analysis.emittedCO2'
    )
    expect(getByTestId('PieChart').getAttribute('data-options')).toEqual(
      'options'
    )
    expect(getByTestId('PieChart').getAttribute('data-test')).toEqual('data')
    expect(getByTestId('PieChart').getAttribute('data-total')).toEqual('48 kg')
  })

  it('should computeAggregatedTimeseries from timeseries', () => {
    render(<LoadedPurposesList timeseries={timeseries} />)

    expect(computeAggregatedTimeseries).toHaveBeenCalledWith(timeseries)
  })

  it('should sortTimeseriesByCO2GroupedByPurpose from computeAggregatedTimeseries', () => {
    render(<LoadedPurposesList timeseries={timeseries} />)

    expect(sortTimeseriesByCO2GroupedByPurpose).toHaveBeenCalledWith(
      aggregatedTimeseries
    )
  })

  it('should computeCO2Timeseries from computeAggregatedTimeseries', () => {
    render(<LoadedPurposesList timeseries={timeseries} />)

    expect(computeCO2Timeseries).toHaveBeenCalledWith(aggregatedTimeseries)
  })

  it('should makeChartProps from computeAggregatedTimeseries', () => {
    render(<LoadedPurposesList timeseries={timeseries} />)

    expect(makeChartProps).toHaveBeenCalledWith(
      {
        WORK: { timeseries: [], totalCO2: 23 },
        firstTimeserieSortedByPurposes: { timeseries: [], totalCO2: 22 }
      },
      'purposes',
      t
    )
  })
})
