import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Button from 'cozy-ui/transpiled/react/Buttons'

const BikeGoalOnboarding = () => {
  const { t } = useI18n()
  const location = useLocation()
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(location.state.background)
  }

  const handleForward = () => {
    navigate('/bikegoal')
  }

  return (
    <Dialog
      open
      disableGutters
      title={t('bikeGoal.onboarding.title')}
      content={
        <>
          <div>⚠️ under construction ⚠️</div>
          <Button
            onClick={handleForward}
            label={t('bikeGoal.onboarding.actions.finish')}
          />
        </>
      }
      onClose={handleBack}
    />
  )
}

export default BikeGoalOnboarding
