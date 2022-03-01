import React, { useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import cx from 'classnames'

import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import {
  computeAggregatedTimeseries,
  sortTimeseriesByCO2GroupedByMode,
  computeCO2Timeseries,
  transformTimeseriesToTrips
} from 'src/lib/timeseries'
import { formatCO2 } from 'src/lib/trips'
import { makeChartProps } from 'src/components/Analysis/helpers'
import AnalysisListItem from 'src/components/Analysis/AnalysisListItem'
import PieChart from 'src/components/PieChart/PieChart'
import TripsList from 'src/components/TripsList'

const LoadedModesList = ({ timeseries }) => {
  const { mode } = useParams()
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()

  const aggregatedTimeseries = useCallback(
    computeAggregatedTimeseries(timeseries),
    [timeseries]
  )
  const timeseriesSortedByModes = useCallback(
    sortTimeseriesByCO2GroupedByMode(aggregatedTimeseries),
    [aggregatedTimeseries]
  )
  const totalCO2 = useCallback(computeCO2Timeseries(aggregatedTimeseries), [
    aggregatedTimeseries
  ])
  const { data, options } = useCallback(
    makeChartProps(timeseriesSortedByModes, 'modes', t),
    [t, timeseriesSortedByModes]
  )

  const trips = useMemo(() => {
    if (mode) {
      return transformTimeseriesToTrips(
        timeseriesSortedByModes[mode].timeseries
      )
    }
    return []
  }, [mode, timeseriesSortedByModes])

  return !mode ? (
    <>
      <div
        className={cx('u-flex u-mt-1', {
          'u-flex-justify-end u-mr-2': !isMobile,
          'u-flex-justify-center': isMobile
        })}
      >
        <PieChart
          data={data}
          options={options}
          total={formatCO2(totalCO2)}
          label={t('analysis.emittedCO2')}
        />
      </div>
      <List>
        {Object.entries(timeseriesSortedByModes).map(
          (timeseriesSortedByMode, index) => (
            <AnalysisListItem
              key={index}
              type="modes"
              totalCO2={totalCO2}
              sortedTimeserie={timeseriesSortedByMode}
            />
          )
        )}
      </List>
    </>
  ) : (
    <TripsList
      trips={trips}
      timeseries={timeseriesSortedByModes[mode].timeseries}
    />
  )
}

export default LoadedModesList
