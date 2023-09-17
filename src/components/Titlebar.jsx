/* global cozy */

import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

import BarTitle from 'cozy-ui/transpiled/react/BarTitle'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Previous from 'cozy-ui/transpiled/react/Icons/Previous'
import MuiCozyTheme from 'cozy-ui/transpiled/react/MuiCozyTheme'
import Typography from 'cozy-ui/transpiled/react/Typography'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

const Titlebar = ({ label, subtitle, onBack }) => {
  const { isMobile } = useBreakpoints()
  const { BarCenter, BarLeft } = cozy.bar

  const backAction = typeof onBack === 'function' ? onBack : undefined

  if (isMobile) {
    return (
      <>
        {backAction && (
          <BarLeft>
            <IconButton
              className="u-mr-half"
              onClick={backAction}
              size="medium"
            >
              <Icon icon={Previous} size={16} />
            </IconButton>
          </BarLeft>
        )}
        <BarCenter>
          <MuiCozyTheme>
            <BarTitle>{label}</BarTitle>
          </MuiCozyTheme>
        </BarCenter>
      </>
    )
  }

  return (
    <div
      className={cx({
        ['u-flex u-flex-items-baseline u-ml-2']: backAction
      })}
    >
      {backAction && (
        <IconButton className="u-mr-half" onClick={backAction} size="medium">
          <Icon icon={Previous} size={16} />
        </IconButton>
      )}
      <div
        className={cx('u-mv-1-half-s u-ml-1-s u-mv-2', {
          ['u-ml-2']: !backAction
        })}
      >
        <Typography variant="h3">{label}</Typography>
        {subtitle}
      </div>
    </div>
  )
}

Titlebar.propTypes = {
  label: PropTypes.string,
  subtitle: PropTypes.node,
  onBack: PropTypes.func
}

export default Titlebar
