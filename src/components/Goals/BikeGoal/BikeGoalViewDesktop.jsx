import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate, useParams } from 'react-router-dom'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import Titlebar from 'src/components/Titlebar'
import BikeGoalList from 'src/components/Goals/BikeGoal/BikeGoalList'
import BikeGoalAchievement from 'src/components/Goals/BikeGoal/BikeGoalAchievement'
import BikeGoalChart from 'src/components/Goals/BikeGoal/BikeGoalChart'
import BikeGoalActions from 'src/components/Goals/BikeGoal/BikeGoalActions'
import { filterTimeseriesByYear } from 'src/lib/timeseries'

const BikeGoalViewDesktop = ({ timeseries, timeseriesQueryLeft }) => {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { year } = useParams()

  const timeseriesByYear = filterTimeseriesByYear(timeseries, year)

  return (
    <>
      <Titlebar
        label={t('bikeGoal.title')}
        subtitle={<BikeGoalAchievement timeseries={timeseriesByYear} />}
        onBack={() => navigate('/trips')}
      />
      <BikeGoalActions timeseries={timeseries} />
      <BikeGoalChart
        display="flex"
        position="absolute"
        top="2rem"
        right="2rem"
        timeseries={timeseriesByYear}
      />
      <BikeGoalList
        className="u-mt-3"
        timeseries={timeseriesByYear}
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
