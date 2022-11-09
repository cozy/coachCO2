import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import BikeGoalDateSelector from 'src/components/Goals/BikeGoal/DateSelector/BikeGoalDateSelector'
import BikeGoalOptionSelector from 'src/components/Goals/BikeGoal/OptionSelector/BikeGoalOptionSelector'

const createStyles = ({ isMobile }) => ({
  actions: {
    right: isMobile ? 0 : '13rem'
  }
})

const BikeGoalActions = ({ timeseries }) => {
  const { isMobile } = useBreakpoints()

  const styles = createStyles({ isMobile })

  return (
    <div
      className={cx('u-flex u-flex-justify-end', {
        'u-pos-absolute u-top-m': !isMobile
      })}
      style={styles.actions}
    >
      <BikeGoalDateSelector timeseries={timeseries} />
      <BikeGoalOptionSelector />
    </div>
  )
}

BikeGoalDateSelector.propTypes = {
  timeseries: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default BikeGoalActions
