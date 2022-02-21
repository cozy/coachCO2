import React, { useMemo } from 'react'
import cx from 'classnames'

import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import {
  computeAggregatedTimeseries,
  sortTimeseriesByCO2GroupedByMode,
  computeCO2Timeseries
} from 'src/lib/timeseries'
import { formatCO2 } from 'src/lib/trips'
import { makeChartProps } from 'src/components/Analysis/Modes/helpers'
import ModeItem from 'src/components/Analysis/Modes/ModeItem'
import PieChart from 'src/components/PieChart/PieChart'

const LoadedModesList = ({ timeseries }) => {
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
  const totalCO2 = useMemo(() => computeCO2Timeseries(aggregatedTimeseries), [
    aggregatedTimeseries
  ])
  const { data, options } = useMemo(
    () => makeChartProps(timeseriesSortedByModes, 'modes', t),
    [t, timeseriesSortedByModes]
  )

  return (
    <>
      <div
        className={cx('u-flex', {
          ['u-flex-justify-end u-mr-2']: !isMobile,
          'u-flex-justify-center u-mt-1': isMobile
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
            <ModeItem
              key={index}
              totalCO2={totalCO2}
              timeseriesSortedByMode={timeseriesSortedByMode}
            />
          )
        )}
      </List>
    </>
  )
}

export default LoadedModesList
