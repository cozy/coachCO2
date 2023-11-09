import PropTypes from 'prop-types'
import React from 'react'
import TripsList from 'src/components/TripsList'

import LoadMore from 'cozy-ui/transpiled/react/LoadMore'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const BikeGoalList = ({ className, timeseries, hasMore, fetchMore }) => {
  const { t } = useI18n()

  if (timeseries?.length === 0) {
    return (
      <Typography className="u-mt-2 u-p-2" variant="h5" align="center">
        {t('bikeGoal.empty.title')}
      </Typography>
    )
  }

  return (
    <div className={className}>
      <TripsList timeseries={timeseries} noHeader />
      {hasMore && <LoadMore label={t('loadMore')} fetchMore={fetchMore} />}
    </div>
  )
}

BikeGoalList.propTypes = {
  className: PropTypes.string,
  timeseries: PropTypes.arrayOf(PropTypes.object).isRequired,
  hasMore: PropTypes.bool,
  fetchMore: PropTypes.func
}

export default BikeGoalList
