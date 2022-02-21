import React from 'react'

import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import Titlebar from 'src/components/Titlebar'
import TabsNav from 'src/components/Analysis/TabsNav'

const PurposeAnalysis = () => {
  const { isMobile } = useBreakpoints()

  return (
    <>
      <Titlebar />
      {isMobile && <TabsNav />}
    </>
  )
}

export default PurposeAnalysis
