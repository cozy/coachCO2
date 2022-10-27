import React from 'react'
import { useNavigate } from 'react-router-dom'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Alert from 'cozy-ui/transpiled/react/Alert'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import { getBountyAmount } from 'src/components/Goals/BikeGoal/helpers'
import { useBikeGoalDateContext } from 'src/components/Providers/BikeGoalDateProvider'
import useSettings from 'src/hooks/useSettings'

const BikeGoalAlertSuccess = () => {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { date } = useBikeGoalDateContext()
  const { save: setShowAlertSuccess } = useSettings('bikeGoal.showAlertSuccess')

  const handleConfirm = () => {
    setShowAlertSuccess(false)
    navigate(`certificate/generate/${date.getFullYear()}`)
  }

  return (
    <Alert
      className="u-mh-1-s u-mh-2 u-mb-1 u-flex-items-start"
      block
      severity="success"
      action={
        <Button
          variant="text"
          color="success"
          label={t('bikeGoal.alert.success.action', {
            bountyAmount: getBountyAmount()
          })}
          onClick={handleConfirm}
        />
      }
    >
      {t('bikeGoal.alert.success.text')}
    </Alert>
  )
}

export default BikeGoalAlertSuccess
