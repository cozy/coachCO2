import PropTypes from 'prop-types'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BikeGoalAchievement from 'src/components/Goals/BikeGoal/BikeGoalAchievement'
import BikeGoalActions from 'src/components/Goals/BikeGoal/BikeGoalActions'
import BikeGoalChart from 'src/components/Goals/BikeGoal/BikeGoalChart'
import BikeGoalList from 'src/components/Goals/BikeGoal/BikeGoalList'
import { filterTimeseriesByYear } from 'src/lib/timeseries'

import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'

const BikeGoalDialogMobile = ({ timeseries, timeseriesQueryLeft }) => {
  const navigate = useNavigate()
  const { year } = useParams()

  const timeseriesByYear = filterTimeseriesByYear(timeseries, year)

  return (
    <Dialog
      open
      onClose={() => navigate('/trips')}
      disableGutters
      componentsProps={{
        dialogTitle: {
          className: 'u-p-0'
        }
      }}
      title={<BikeGoalActions timeseries={timeseries} />}
      content={
        <>
          <BikeGoalChart
            display="flex"
            paddingTop="1.5rem"
            marginTop="3rem"
            timeseries={timeseriesByYear}
          />
          <BikeGoalAchievement
            className="u-flex u-flex-column u-flex-items-center"
            timeseries={timeseriesByYear}
          />
          <BikeGoalList
            className="u-mt-2"
            timeseries={timeseriesByYear}
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
