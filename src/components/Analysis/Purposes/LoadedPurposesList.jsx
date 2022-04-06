import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import cx from 'classnames'

import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import Box from 'cozy-ui/transpiled/react/Box'

import {
  computeAggregatedTimeseries,
  sortTimeseriesByCO2GroupedByPurpose,
  computeCO2Timeseries
} from 'src/lib/timeseries'
import { formatCO2 } from 'src/lib/trips'
import { makeChartProps } from 'src/components/Analysis/helpers'
import AnalysisListItem from 'src/components/Analysis/AnalysisListItem'
import PieChart from 'src/components/PieChart/PieChart'
import TripsList from 'src/components/TripsList'

const LoadedPurposesList = ({ timeseries }) => {
  const { purpose } = useParams()
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()

  const aggregatedTimeseries = useMemo(
    () => computeAggregatedTimeseries(timeseries),
    [timeseries]
  )
  const timeseriesSortedByPurposes = useMemo(
    () => sortTimeseriesByCO2GroupedByPurpose(aggregatedTimeseries),
    [aggregatedTimeseries]
  )
  const totalCO2 = useMemo(() => computeCO2Timeseries(aggregatedTimeseries), [
    aggregatedTimeseries
  ])
  const { data, options } = useMemo(
    () => makeChartProps(timeseriesSortedByPurposes, 'purposes', t),
    [t, timeseriesSortedByPurposes]
  )

  const tripsListTimeseries = useMemo(
    () =>
      purpose
        ? timeseriesSortedByPurposes[purpose].timeseries.sort((a, b) =>
            a.startDate.localeCompare(b.startDate)
          )
        : [],
    [purpose, timeseriesSortedByPurposes]
  )

  if (!purpose) {
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
            total={formatCO2(totalCO2)}
            label={t('analysis.emittedCO2')}
          />
        </div>
        <Box marginTop={!isMobile ? '6rem' : undefined}>
          <List>
            {Object.entries(timeseriesSortedByPurposes).map(
              (timeseriesSortedByPurpose, index) => (
                <AnalysisListItem
                  key={index}
                  type="purposes"
                  totalCO2={totalCO2}
                  sortedTimeserie={timeseriesSortedByPurpose}
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

export default LoadedPurposesList
