import PropTypes from 'prop-types'
import React from 'react'
import {
  makeGoalAchievementPercentage,
  makeIconSize,
  makeDaccAchievementPercentage
} from 'src/components/Goals/BikeGoal/helpers'

import Box from 'cozy-ui/transpiled/react/Box'
import CircularChart from 'cozy-ui/transpiled/react/CircularChart'

const BikeGoalChart = ({ timeseries, sendToDACC, size, ...props }) => {
  const goalAchievementPercentage = makeGoalAchievementPercentage(timeseries)
  const iconSize = makeIconSize(size)

  return (
    <CircularChart
      size={size}
      primaryProps={{ value: goalAchievementPercentage, color: '#BA5AE8' }}
      {...(sendToDACC && {
        secondaryProps: {
          value: makeDaccAchievementPercentage(),
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
