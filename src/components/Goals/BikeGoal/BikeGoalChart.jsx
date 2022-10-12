import React from 'react'
import PropTypes from 'prop-types'

import CircularChart from 'cozy-ui/transpiled/react/CircularChart'
import Box from 'cozy-ui/transpiled/react/Box'

import { makeGoalAchievementPercentage } from 'src/components/Goals/BikeGoal/helpers'

const BikeGoalChart = ({ className, timeseries }) => {
  const goalAchievementPercentage = makeGoalAchievementPercentage(timeseries)

  return (
    <div className={className}>
      <CircularChart
        primaryProps={{ value: goalAchievementPercentage, color: '#BA5AE8' }}
      >
        <Box fontSize="4.5rem">🚴</Box>
      </CircularChart>
    </div>
  )
}

BikeGoalChart.propTypes = {
  className: PropTypes.string,
  timeseries: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default BikeGoalChart
