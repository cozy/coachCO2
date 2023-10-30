import PropTypes from 'prop-types'
import React from 'react'
import Welcome from 'src/components/EmptyContent/Welcome'

import Spinner from 'cozy-ui/transpiled/react/Spinner'

const SpinnerOrEmptyContent = ({
  account,
  isAccountLoading,
  isTimeseriesLoading,
  timeseries
}) => {
  if (isAccountLoading) {
    return (
      <Spinner size="xxlarge" className="u-flex u-flex-justify-center u-mt-1" />
    )
  }

  if (!account) {
    return <Welcome />
  }

  if (isTimeseriesLoading) {
    return (
      <Spinner size="xxlarge" className="u-flex u-flex-justify-center u-mt-1" />
    )
  }

  if (timeseries.length === 0) {
    return <Welcome />
  }
}

SpinnerOrEmptyContent.propTypes = {
  account: PropTypes.object,
  isAccountLoading: PropTypes.bool,
  isTimeseriesLoading: PropTypes.bool,
  timeseries: PropTypes.arrayOf(PropTypes.object)
}

export default SpinnerOrEmptyContent
