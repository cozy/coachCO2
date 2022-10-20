import React from 'react'
import PropTypes from 'prop-types'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import DaccManager from 'src/components/DaccManager/DaccManager'

const BikeGoalDaccManager = ({ onClose, onRefuse, onAccept }) => {
  const { t } = useI18n()

  return (
    <DaccManager
      onClose={onClose}
      onRefuse={onRefuse}
      onAccept={onAccept}
      componentProps={{
        DaccPermissionsDialog: {
          sharedDataLabel: t(
            'dacc.permissionsDialog.anonymized_bikegoal_progression'
          )
        }
      }}
    />
  )
}

BikeGoalDaccManager.propTypes = {
  onClose: PropTypes.func.isRequired,
  onRefuse: PropTypes.func.isRequired,
  onAccept: PropTypes.func.isRequired
}

export default BikeGoalDaccManager
