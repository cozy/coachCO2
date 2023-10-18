import PropTypes from 'prop-types'
import React from 'react'
import {
  makeGoalAchievementPercentage,
  makeIconSize,
  makeDaccAchievementPercentage
} from 'src/components/Goals/BikeGoal/helpers'
import { buildSettingsQuery } from 'src/queries/queries'

import { isQueryLoading, useQuery } from 'cozy-client'
import Box from 'cozy-ui/transpiled/react/Box'
import CircularChart from 'cozy-ui/transpiled/react/CircularChart'

const BikeGoalChart = ({ timeseries, sendToDACC, size, ...props }) => {
  const settingsQuery = buildSettingsQuery()
  const { data: settings, ...settingsQueryLeft } = useQuery(
    settingsQuery.definition,
    settingsQuery.options
  )
  const isLoading = isQueryLoading(settingsQueryLeft)

  if (isLoading) {
    return null
  }

  const goalAchievementPercentage = makeGoalAchievementPercentage(
    timeseries,
    settings
  )
  const iconSize = makeIconSize(size)

  return (
    <CircularChart
      size={size}
      primaryProps={{ value: goalAchievementPercentage, color: '#BA5AE8' }}
      {...(sendToDACC && {
        secondaryProps: {
          value: makeDaccAchievementPercentage(settings),
          color: '#BA5AE83D'
        }
      })}
      {...props}
    >
      <Box fontSize={iconSize}>🚴</Box>
    </CircularChart>
  )
}

BikeGoalChart.propTypes = {
  className: PropTypes.string,
  timeseries: PropTypes.arrayOf(PropTypes.object)
}

export default BikeGoalChart
