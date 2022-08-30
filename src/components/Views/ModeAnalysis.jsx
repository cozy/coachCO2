import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import SelectDatesProvider from 'src/components/Providers/SelectDatesProvider'
import Titlebar from 'src/components/Titlebar'
import ModesList from 'src/components/Analysis/Modes/ModesList'
import TabsNav from 'src/components/Analysis/TabsNav'
import SelectDatesWrapper from 'src/components/SelectDatesWrapper'

const ModeAnalysis = () => {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { mode } = useParams()
  const { isMobile } = useBreakpoints()

  const modeTitle = mode ? t(`trips.modes.${mode.toUpperCase()}`) : ''

  const onBack = mode ? () => navigate(-1) : undefined

  return (
    <SelectDatesProvider>
      <Titlebar label={modeTitle} onBack={onBack} />
      {isMobile && <TabsNav />}
      <SelectDatesWrapper />
      <ModesList />
    </SelectDatesProvider>
  )
}

export default ModeAnalysis
