import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

import { IllustrationDialog } from 'cozy-ui/transpiled/react/CozyDialogs'

import BikeGoalList from 'src/components/Goals/BikeGoal/BikeGoalList'
import BikeGoalAchievement from 'src/components/Goals/BikeGoal/BikeGoalAchievement'
import BikeGoalChart from 'src/components/Goals/BikeGoal/BikeGoalChart'

const BikeGoalDialogMobile = ({ timeseries, timeseriesQueryLeft }) => {
  const navigate = useNavigate()

  return (
    <IllustrationDialog
      open
      onBack={() => navigate('/')}
      disableGutters
      content={
        <>
          <BikeGoalChart
            className="u-flex u-flex-justify-center u-pt-1-half u-mt-3"
            timeseries={timeseries}
          />
          <BikeGoalAchievement
            className="u-flex u-flex-column u-flex-items-center"
            timeseries={timeseries}
          />
          <BikeGoalList
            className="u-mt-2"
            timeseries={timeseries}
            hasMore={timeseriesQueryLeft.hasMore}
            fetchMore={timeseriesQueryLeft.fetchMore}
          />
        </>
      }
    />
  )
}

BikeGoalDialogMobile.propTypes = {
  timeseries: PropTypes.arrayOf(PropTypes.object).isRequired,
  timeseriesQueryLeft: PropTypes.object.isRequired
}

export default BikeGoalDialogMobile
