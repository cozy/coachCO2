/* global cozy */

import React from 'react'
import { useLocation } from 'react-router-dom'
import cx from 'classnames'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import MuiCozyTheme from 'cozy-ui/transpiled/react/MuiCozyTheme'
import Typography from 'cozy-ui/transpiled/react/Typography'
import BarTitle from 'cozy-ui/transpiled/react/BarTitle'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Previous from 'cozy-ui/transpiled/react/Icons/Previous'

const pathnameToTitle = {
  '/trips': 'nav.trips',
  '/analysis/modes': 'analysis.mode',
  '/analysis/purposes': 'analysis.purpose',
  '/settings': 'nav.settings'
}

const Titlebar = ({ label, onBack }) => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const { pathname } = useLocation()
  const { BarCenter, BarLeft } = cozy.bar

  const title = label || t(pathnameToTitle[pathname])
  const backAction = typeof onBack === 'function' ? onBack : undefined

  if (isMobile) {
    return (
      <>
        {backAction && (
          <BarLeft>
            <IconButton
              className={'u-mr-half'}
              onClick={backAction}
              size="medium"
            >
              <Icon icon={Previous} size={16} />
            </IconButton>
          </BarLeft>
        )}
        <BarCenter>
          <MuiCozyTheme>
            <BarTitle>{title}</BarTitle>
          </MuiCozyTheme>
        </BarCenter>
      </>
    )
  }

  return (
    <div
      className={cx({
        ['u-flex u-flex-items-center u-ml-2']: backAction
      })}
    >
      {backAction && (
        <IconButton className="u-mr-half" onClick={backAction} size="medium">
          <Icon icon={Previous} size={16} />
        </IconButton>
      )}
      <Typography
        variant="h3"
        className={cx('u-mv-1-half-s u-ml-1-s u-mv-2', {
          ['u-ml-2']: !backAction
        })}
      >
        {title}
      </Typography>
    </div>
  )
}

export default Titlebar
