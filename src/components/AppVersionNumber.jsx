import React from 'react'

import Box from 'cozy-ui/transpiled/react/Box'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import { version } from '../../manifest.webapp'

const AppVersionNumber = () => {
  const { isMobile } = useBreakpoints()

  return (
    <Box
      color="var(--infoColor)"
      position="fixed"
      right="1rem"
      bottom={`calc(1rem + ${isMobile ? 'var(--sidebarHeight)' : '0rem'})`}
    >
      {version}
    </Box>
  )
}

export default AppVersionNumber
