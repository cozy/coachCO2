import React from 'react'

import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import Titlebar from 'src/components/Titlebar'
import ModesList from 'src/components/Analysis/Modes/ModesList'
import TabsNav from 'src/components/Analysis/TabsNav'

const ModeAnalysis = () => {
  const { isMobile } = useBreakpoints()

  return (
    <>
      <Titlebar />
      {isMobile && <TabsNav />}
      <ModesList />
    </>
  )
}

export default ModeAnalysis
