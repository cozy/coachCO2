/* global cozy */

import React from 'react'
import { useLocation } from 'react-router-dom'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import MuiCozyTheme from 'cozy-ui/transpiled/react/MuiCozyTheme'
import Typography from 'cozy-ui/transpiled/react/Typography'
import BarTitle from 'cozy-ui/transpiled/react/BarTitle'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

const pathnameToTitle = {
  '/trips': 'nav.trips',
  '/analysis/modes': 'analysis.mode',
  '/settings': 'nav.settings'
}

const Titlebar = ({ label }) => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const { pathname } = useLocation()
  const { BarCenter } = cozy.bar

  const title = label || t(pathnameToTitle[pathname])

  if (isMobile) {
    return (
      <BarCenter>
        <MuiCozyTheme>
          <BarTitle>{title}</BarTitle>
        </MuiCozyTheme>
      </BarCenter>
    )
  }

  return (
    <Typography variant="h3" className="u-mv-1-half-s u-ml-1-s u-mv-2 u-ml-2">
      {title}
    </Typography>
  )
}

export default Titlebar
