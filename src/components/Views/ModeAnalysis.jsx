import React from 'react'
import { useParams, useHistory } from 'react-router-dom'

import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import SelectDatesProvider from 'src/components/Providers/SelectDatesProvider'
import Titlebar from 'src/components/Titlebar'
import ModesList from 'src/components/Analysis/Modes/ModesList'
import TabsNav from 'src/components/Analysis/TabsNav'
import SelectDates from 'src/components/SelectDates'

const ModeAnalysis = () => {
  const { t } = useI18n()
  const history = useHistory()
  const { mode } = useParams()
  const { isMobile } = useBreakpoints()

  const modeTitle = mode ? t(`trips.modes.${mode}`) : ''

  const onBack = mode ? history.goBack : undefined

  return (
    <SelectDatesProvider>
      <Titlebar label={modeTitle} onBack={onBack} />
      {isMobile && <TabsNav />}
      <SelectDates />
      <ModesList />
    </SelectDatesProvider>
  )
}

export default ModeAnalysis
