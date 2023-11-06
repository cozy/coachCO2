import PropTypes from 'prop-types'
import React from 'react'
import EmptyContentManager from 'src/components/EmptyContent/EmptyContentManager'
import InstallKonnector from 'src/components/EmptyContent/InstallKonnector'

import Spinner from 'cozy-ui/transpiled/react/Spinner'

const SpinnerOrEmptyContent = ({
  account,
  accounts,
  isAccountLoading,
  isTimeseriesLoading,
  timeseries
}) => {
  if (isAccountLoading || isTimeseriesLoading) {
    return (
      <Spinner size="xxlarge" className="u-flex u-flex-justify-center u-mt-1" />
    )
  }

  if (accounts.length === 0) {
    return <InstallKonnector />
  }

  if (timeseries.length === 0) {
    return <EmptyContentManager account={account} accounts={accounts} />
  }
}

SpinnerOrEmptyContent.propTypes = {
  account: PropTypes.object,
  isAccountLoading: PropTypes.bool,
  isTimeseriesLoading: PropTypes.bool,
  timeseries: PropTypes.arrayOf(PropTypes.object)
}

export default SpinnerOrEmptyContent
