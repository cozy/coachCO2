import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import Titlebar from 'src/components/Titlebar'
import BikeGoalList from 'src/components/Goals/BikeGoal/BikeGoalList'
import BikeGoalAchievement from 'src/components/Goals/BikeGoal/BikeGoalAchievement'
import BikeGoalChart from 'src/components/Goals/BikeGoal/BikeGoalChart'
import BikeGoalActions from 'src/components/Goals/BikeGoal/BikeGoalActions'

const BikeGoalViewDesktop = ({ timeseries, timeseriesQueryLeft }) => {
  const { t } = useI18n()
  const navigate = useNavigate()

  return (
    <>
      <Titlebar
        label={t('bikeGoal.title')}
        subtitle={<BikeGoalAchievement timeseries={timeseries} />}
        onBack={() => navigate('/trips')}
      />
      <BikeGoalActions timeseries={timeseries} />
      <BikeGoalChart
        display="flex"
        position="absolute"
        top="2rem"
        right="2rem"
        timeseries={timeseries}
      />
      <BikeGoalList
        className="u-mt-3"
        timeseries={timeseries}
        hasMore={timeseriesQueryLeft.hasMore}
        fetchMore={timeseriesQueryLeft.fetchMore}
      />
    </>
  )
}

BikeGoalViewDesktop.propTypes = {
  timeseries: PropTypes.arrayOf(PropTypes.object).isRequired,
  timeseriesQueryLeft: PropTypes.object.isRequired
}

export default BikeGoalViewDesktop
