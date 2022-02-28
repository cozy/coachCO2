import React from 'react'
import { useParams } from 'react-router-dom'

import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import Titlebar from 'src/components/Titlebar'
import TabsNav from 'src/components/Analysis/TabsNav'
import PurposesList from 'src/components/Analysis/Purposes/PurposesList'

const PurposeAnalysis = () => {
  const { t } = useI18n()
  const { purpose } = useParams()
  const { isMobile } = useBreakpoints()

  const title = purpose ? t(`trips.purposes.${purpose}`) : ''

  return (
    <>
      <Titlebar label={title} />
      {isMobile && <TabsNav />}
      <PurposesList />
    </>
  )
}

export default PurposeAnalysis
