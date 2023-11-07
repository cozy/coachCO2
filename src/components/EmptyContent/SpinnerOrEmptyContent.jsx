import PropTypes from 'prop-types'
import React from 'react'
import EmptyContentManager from 'src/components/EmptyContent/EmptyContentManager'
import { useAccountContext } from 'src/components/Providers/AccountProvider'

import Spinner from 'cozy-ui/transpiled/react/Spinner'

const SpinnerOrEmptyContent = ({ isTimeseriesLoading }) => {
  const { account, isAccountLoading } = useAccountContext()

  const isTimeseriesRealyLoading = !!account && isTimeseriesLoading

  if (isAccountLoading || isTimeseriesRealyLoading) {
    return (
      <Spinner size="xxlarge" className="u-flex u-flex-justify-center u-mt-1" />
    )
  }

  return <EmptyContentManager />
}

SpinnerOrEmptyContent.propTypes = {
  isTimeseriesLoading: PropTypes.bool
}

export default SpinnerOrEmptyContent
