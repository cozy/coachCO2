import React from 'react'
import { useNavigate } from 'react-router-dom'
import ModificationModalContent from 'src/components/Goals/BikeGoal/Edit/ModificationModalContent'

import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const BikeGoalEdit = () => {
  const { t } = useI18n()
  const navigate = useNavigate()

  return (
    <Dialog
      open
      disableGutters
      title={t('bikeGoal.edit.title')}
      content={<ModificationModalContent />}
      onClose={() => navigate('..')}
    />
  )
}

export default BikeGoalEdit
