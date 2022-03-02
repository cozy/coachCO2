import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import cx from 'classnames'

import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import {
  computeAggregatedTimeseries,
  sortTimeseriesByCO2GroupedByPurpose,
  computeCO2Timeseries,
  transformTimeseriesToTrips
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

  const trips = useMemo(() => {
    if (purpose) {
      return transformTimeseriesToTrips(
        timeseriesSortedByPurposes[purpose].timeseries
      )
    }
    return []
  }, [purpose, timeseriesSortedByPurposes])

  return !purpose ? (
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
        {Object.entries(timeseriesSortedByPurposes).map(
          (timeseriesSortedByPurpose, index) => (
            <AnalysisListItem
              key={index}
              type="purposes"
              sortedTimeserie={timeseriesSortedByPurpose}
              totalCO2={totalCO2}
            />
          )
        )}
      </List>
    </>
  ) : (
    <TripsList
      trips={trips}
      timeseries={timeseriesSortedByPurposes[purpose].timeseries}
    />
  )
}

export default LoadedPurposesList
