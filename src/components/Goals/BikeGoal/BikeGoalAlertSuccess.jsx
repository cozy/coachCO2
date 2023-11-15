import React from 'react'
import { useNavigate } from 'react-router-dom'
import { getBountyAmount } from 'src/components/Goals/BikeGoal/helpers'
import useSettings from 'src/hooks/useSettings'

import Alert from 'cozy-ui/transpiled/react/Alert'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const BikeGoalAlertSuccess = () => {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { save: setShowAlertSuccess } = useSettings('bikeGoal.showAlertSuccess')

  const handleConfirm = () => {
    setShowAlertSuccess(false)
    const currentYear = new Date().getFullYear().toString()
    navigate(`${currentYear}/certificate/generate`)
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
            smart_count: getBountyAmount() || -1
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
