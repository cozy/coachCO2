import React from 'react'

import Box from 'cozy-ui/transpiled/react/Box'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { version } from '../../manifest.webapp'

const AppVersionNumber = () => {
  const { isMobile } = useBreakpoints()

  return (
    <Box
      color="var(--infoColor)"
      style={{ zIndex: 'var(--zindex-alert)' }}
      position="fixed"
      {...(isMobile
        ? { top: '0.5rem', right: '1rem' }
        : { bottom: '1rem', right: '2rem' })}
    >
      {version}
    </Box>
  )
}

export default AppVersionNumber
