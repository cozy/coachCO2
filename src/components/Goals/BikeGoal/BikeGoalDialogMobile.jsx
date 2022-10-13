import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

import { IllustrationDialog } from 'cozy-ui/transpiled/react/CozyDialogs'

import BikeGoalList from 'src/components/Goals/BikeGoal/BikeGoalList'
import BikeGoalAchievement from 'src/components/Goals/BikeGoal/BikeGoalAchievement'
import BikeGoalChart from 'src/components/Goals/BikeGoal/BikeGoalChart'
import BikeGoalActions from 'src/components/Goals/BikeGoal/BikeGoalActions'

const BikeGoalDialogMobile = ({ timeseries, timeseriesQueryLeft }) => {
  const navigate = useNavigate()

  return (
    <IllustrationDialog
      open
      onBack={() => navigate('/')}
      disableGutters
      content={
        <>
          <BikeGoalActions timeseries={timeseries} />
          <BikeGoalChart
            display="flex"
            paddingTop="1.5rem"
            marginTop="3rem"
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
