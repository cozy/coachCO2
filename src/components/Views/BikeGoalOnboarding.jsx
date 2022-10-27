import React, { useReducer } from 'react'
import { useNavigate } from 'react-router-dom'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import useSettings from 'src/hooks/useSettings'

const BikeGoalOnboarding = () => {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [isBusy, toggleBusy] = useReducer(prev => !prev, false)
  const {
    isLoading,
    value: bikeGoal = {},
    save: setBikeGoal
  } = useSettings('bikeGoal')

  const handleBack = () => {
    navigate('..')
  }

  const handleForward = async () => {
    toggleBusy()
    await setBikeGoal({
      ...bikeGoal,
      onboarded: true,
      activated: true,
      showAlert: false
    })
    navigate('/bikegoal')
  }

  return (
    <Dialog
      open
      disableGutters
      title={t('bikeGoal.onboarding.title')}
      content={
        <>
          {isLoading && (
            <Spinner
              size="xxlarge"
              className="u-flex u-flex-justify-center u-m-1"
            />
          )}
          {!isLoading && (
            <>
              <div>⚠️ under construction ⚠️</div>
              <Button
                onClick={handleForward}
                label={t('bikeGoal.onboarding.actions.finish')}
                busy={isBusy}
              />
            </>
          )}
        </>
      }
      onClose={handleBack}
    />
  )
}

export default BikeGoalOnboarding
