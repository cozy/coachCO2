import React from 'react'
import { useParams } from 'react-router-dom'

import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import Titlebar from 'src/components/Titlebar'
import ModesList from 'src/components/Analysis/Modes/ModesList'
import TabsNav from 'src/components/Analysis/TabsNav'

const ModeAnalysis = () => {
  const { t } = useI18n()
  const { mode } = useParams()
  const { isMobile } = useBreakpoints()

  const title = mode ? t(`trips.modes.${mode}`) : ''

  return (
    <>
      <Titlebar label={title} />
      {isMobile && <TabsNav />}
      <ModesList />
    </>
  )
}

export default ModeAnalysis
