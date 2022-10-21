import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'

import ModificationModalContent from 'src/components/Goals/BikeGoal/Edit/ModificationModalContent'

const BikeGoalEdit = () => {
  const { t } = useI18n()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Dialog
      open
      disableGutters
      title={t('bikeGoal.edit.title')}
      content={<ModificationModalContent />}
      onBack={() => navigate(location.state.background)}
      onClose={() => navigate('/')}
    />
  )
}

export default BikeGoalEdit
