import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import cx from 'classnames'

import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import Box from 'cozy-ui/transpiled/react/Box'
import PieChart from 'cozy-ui/transpiled/react/PieChart'

import {
  computeAggregatedTimeseries,
  sortTimeseriesByCO2GroupedByMode,
  computeCO2Timeseries
} from 'src/lib/timeseries'
import { formatCO2 } from 'src/lib/helpers'
import { makeChartProps } from 'src/components/Analysis/helpers'
import AnalysisListItem from 'src/components/Analysis/AnalysisListItem'
import TripsList from 'src/components/TripsList'

const LoadedModesList = ({ timeseries }) => {
  const { mode } = useParams()
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()

  const aggregatedTimeseries = useMemo(
    () => computeAggregatedTimeseries(timeseries),
    [timeseries]
  )
  const timeseriesSortedByModes = useMemo(
    () => sortTimeseriesByCO2GroupedByMode(aggregatedTimeseries),
    [aggregatedTimeseries]
  )
  const totalCO2 = useMemo(
    () => computeCO2Timeseries(aggregatedTimeseries),
    [aggregatedTimeseries]
  )
  const { data, options } = useMemo(
    () => makeChartProps(timeseriesSortedByModes, 'modes', t),
    [t, timeseriesSortedByModes]
  )

  const tripsListTimeseries = useMemo(
    () =>
      mode
        ? timeseriesSortedByModes[mode].timeseries.sort((a, b) =>
            a.startDate.localeCompare(b.startDate)
          )
        : [],
    [mode, timeseriesSortedByModes]
  )

  if (!mode) {
    return (
      <>
        <div
          className={cx('u-flex', {
            'u-flex-justify-end u-pos-absolute u-top-m u-right-xl': !isMobile,
            'u-flex-justify-center u-mv-1': isMobile
          })}
        >
          <PieChart
            data={data}
            options={options}
            primaryText={formatCO2(totalCO2)}
            secondaryText={t('analysis.emittedCO2')}
          />
        </div>
        <Box marginTop={!isMobile ? '6rem' : undefined}>
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
        </Box>
      </>
    )
  }

  return (
    <div className="u-mt-2">
      <TripsList timeseries={tripsListTimeseries} />
    </div>
  )
}

export default LoadedModesList
