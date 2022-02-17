import React, { useMemo } from 'react'

import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'

import {
  computeAggregatedTimeseries,
  sortTimeseriesByModes,
  computeCO2Timeseries
} from 'src/lib/timeseries'
import ModeItem from 'src/components/Analysis/Modes/ModeItem'

const LoadedModesList = ({ timeseries }) => {
  const aggregatedTimeseries = useMemo(
    () => computeAggregatedTimeseries(timeseries),
    [timeseries]
  )
  const timeseriesSortedByModes = useMemo(
    () => sortTimeseriesByModes(aggregatedTimeseries),
    [aggregatedTimeseries]
  )
  const totalCO2 = useMemo(() => computeCO2Timeseries(aggregatedTimeseries), [
    aggregatedTimeseries
  ])

  return (
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
  )
}

export default React.memo(LoadedModesList)
