import React from 'react'

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

export default BikeGoalDaccManager
