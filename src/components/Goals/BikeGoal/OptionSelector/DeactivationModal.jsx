import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'

import useSettings from 'src/hooks/useSettings'

const DeactivationModal = ({ open, onClose }) => {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { isLoading, save } = useSettings('bikeGoal.activated')
  const [isBusy, setIsBusy] = useState(false)

  const handleDeactivation = () => {
    setIsBusy(true)
    save(false)
    navigate('/')
  }

  return (
    <ConfirmDialog
      open={open}
      title={t('bikeGoal.deactivate.title')}
      content={t('bikeGoal.deactivate.content')}
      actions={
        <>
          <Button
            variant="secondary"
            label={t('bikeGoal.deactivate.cancel')}
            onClick={onClose}
          />
          <Button
            color="error"
            label={t('bikeGoal.deactivate.stop_participate')}
            busy={isBusy || isLoading}
            onClick={handleDeactivation}
          />
        </>
      }
      onClose={onClose}
    />
  )
}

DeactivationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default DeactivationModal
