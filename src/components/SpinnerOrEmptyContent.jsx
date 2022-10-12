import React from 'react'
import PropTypes from 'prop-types'

import { useClient } from 'cozy-client'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import Titlebar from 'src/components/Titlebar'
import EmptyContent from 'src/components/EmptyContent'

const SpinnerOrEmptyContent = ({
  account,
  isAccountLoading,
  isQueryLoading,
  timeseries
}) => {
  const { isMobile } = useBreakpoints()
  const client = useClient()

  if (isAccountLoading) {
    return (
      <Spinner size="xxlarge" className="u-flex u-flex-justify-center u-mt-1" />
    )
  }

  if (!account) {
    return (
      <>
        {isMobile && <Titlebar label={client.appMetadata.slug} />}
        <EmptyContent />
      </>
    )
  }

  if (isQueryLoading) {
    return (
      <Spinner size="xxlarge" className="u-flex u-flex-justify-center u-mt-1" />
    )
  }

  if (timeseries.length === 0) {
    return (
      <>
        {isMobile && <Titlebar label={client.appMetadata.slug} />}
        <EmptyContent />
      </>
    )
  }
}

SpinnerOrEmptyContent.propTypes = {
  account: PropTypes.object,
  isAccountLoading: PropTypes.bool,
  isQueryLoading: PropTypes.bool,
  timeseries: PropTypes.arrayOf(PropTypes.object)
}

export default SpinnerOrEmptyContent
