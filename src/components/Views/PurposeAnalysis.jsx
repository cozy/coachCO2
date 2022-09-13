import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import Titlebar from 'src/components/Titlebar'
import TabsNav from 'src/components/Analysis/TabsNav'
import PurposesList from 'src/components/Analysis/Purposes/PurposesList'
import SelectDatesWrapper from 'src/components/SelectDatesWrapper'

const PurposeAnalysis = () => {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { purpose } = useParams()
  const { isMobile } = useBreakpoints()

  const purposeTitle = purpose
    ? t(`trips.purposes.${purpose.toUpperCase()}`)
    : ''

  const onBack = purpose ? () => navigate('/analysis/purposes') : undefined

  return (
    <>
      <Titlebar label={purposeTitle} onBack={onBack} />
      {isMobile && <TabsNav />}
      <SelectDatesWrapper />
      <PurposesList />
    </>
  )
}

export default PurposeAnalysis
