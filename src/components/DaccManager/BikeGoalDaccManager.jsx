import PropTypes from 'prop-types'
import React from 'react'
import DaccManager from 'src/components/DaccManager/DaccManager'

import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

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
