import cx from 'classnames'
import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import AnalysisListItem from 'src/components/Analysis/AnalysisListItem'
import { makeChartProps } from 'src/components/Analysis/helpers'
import TripsList from 'src/components/TripsList'
import { formatCO2 } from 'src/lib/helpers'
import {
  sortTimeseriesByCO2GroupedByMode,
  computeCO2Timeseries
} from 'src/lib/timeseries'

import Box from 'cozy-ui/transpiled/react/Box'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import List from 'cozy-ui/transpiled/react/List'
import PieChart from 'cozy-ui/transpiled/react/PieChart'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

const LoadedModesList = ({ timeseries }) => {
  const { mode } = useParams()
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()

  const timeseriesSortedByModes = useMemo(
    () => sortTimeseriesByCO2GroupedByMode(timeseries),
    [timeseries]
  )

  const totalCO2 = computeCO2Timeseries(timeseries)

  const { data, options } = useMemo(
    () => makeChartProps(timeseriesSortedByModes, 'modes', t),
    [t, timeseriesSortedByModes]
  )

  const tripsListTimeseries = useMemo(
    () =>
      mode
        ? timeseriesSortedByModes[mode].timeseries.sort((a, b) =>
            b.startDate.localeCompare(a.startDate)
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
