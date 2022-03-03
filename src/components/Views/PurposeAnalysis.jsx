import React from 'react'
import { useParams, useHistory } from 'react-router-dom'

import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import Titlebar from 'src/components/Titlebar'
import TabsNav from 'src/components/Analysis/TabsNav'
import SelectDatesProvider from 'src/components/Providers/SelectDatesProvider'
import PurposesList from 'src/components/Analysis/Purposes/PurposesList'
import SelectDates from 'src/components/SelectDates'

const PurposeAnalysis = () => {
  const { t } = useI18n()
  const history = useHistory()
  const { purpose } = useParams()
  const { isMobile } = useBreakpoints()

  const purposeTitle = purpose ? t(`trips.purposes.${purpose}`) : ''

  const onBack = purpose ? history.goBack : undefined

  return (
    <SelectDatesProvider>
      <Titlebar label={purposeTitle} onBack={onBack} />
      {isMobile && <TabsNav />}
      <SelectDates />
      <PurposesList />
    </SelectDatesProvider>
  )
}

export default PurposeAnalysis
