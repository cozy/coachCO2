import PropTypes from 'prop-types'
import React from 'react'
import TripsList from 'src/components/TripsList'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import LoadMore from 'cozy-ui/transpiled/react/LoadMore'

const BikeGoalList = ({ className, timeseries, hasMore, fetchMore }) => {
  const { t } = useI18n()

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
