import React, { useCallback, useMemo, useState } from 'react'

import { useClient } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import NestedSelectModal from 'cozy-ui/transpiled/react/NestedSelect/Modal'

import { purposes } from 'src/components/helpers'
import { PurposeAvatar } from 'src/components/Avatar'
import { useTrip } from 'src/components/Providers/TripProvider'
import { OTHER_PURPOSE, RECURRING_PURPOSES_SERVICE_NAME } from 'src/constants'
import {
  getTimeseriePurpose,
  setAutomaticPurpose,
  setManualPurpose
} from 'src/lib/timeseries'
import { startService } from 'src/lib/services'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { Button } from 'cozy-ui/transpiled/react/Button'

const makeOptions = t => {
  const options = purposes.map(purpose => ({
    id: purpose,
    title: t(`trips.purposes.${purpose}`),
    icon: <PurposeAvatar attribute={purpose} />
  }))
  return { children: options }
}

const PurposeEditDialog = ({ onClose }) => {
  const [showRecurringDialog, setShowRecurringDialog] = useState(false)
  const [selectedPurpose, setSelectedPurpose] = useState(null)
  const { t } = useI18n()
  const client = useClient()
  const { timeserie } = useTrip()

  const handleSelect = useCallback(
    async item => {
      setSelectedPurpose(item.id)
      const oldPurpose = getTimeseriePurpose(timeserie)
      if (oldPurpose !== OTHER_PURPOSE) {
        setShowRecurringDialog(true)
        return
      }
      handleRecurringTrip({ purpose: item.id, oldPurpose })

      onClose()
    },
    [client, timeserie, onClose]
  )

  const saveTripWithPurpose = async ({ purpose, isRecurringTrip } = {}) => {
    let newTimeserie = { ...timeserie }
    if (isRecurringTrip) {
      newTimeserie = setAutomaticPurpose(newTimeserie, purpose, {
        isRecurringTrip
      })
    }
    newTimeserie = setManualPurpose(newTimeserie, purpose, {
      isRecurringTrip
    })
    await client.save(newTimeserie)
  }

  const handleOccasionalTrip = async () => {
    await saveTripWithPurpose({
      purpose: selectedPurpose,
      isRecurringTrip: false
    })
    onClose()
  }

  const handleRecurringTrip = async ({ purpose, oldPurpose } = {}) => {
    await saveTripWithPurpose({
      purpose: purpose || selectedPurpose,
      isRecurringTrip: true
    })

    // Start service to set the purpose to similar trips
    startService(client, RECURRING_PURPOSES_SERVICE_NAME, {
      fields: {
        docId: timeserie._id,
        oldPurpose: oldPurpose || getTimeseriePurpose(timeserie)
      }
    })
    onClose()
  }

  const isSelected = useMemo(
    () => item => {
      const manualPurpose = getTimeseriePurpose(timeserie)
      return manualPurpose
        ? item.id === manualPurpose
        : item.id === OTHER_PURPOSE
    },
    [timeserie]
  )

  if (showRecurringDialog) {
    return (
      <ConfirmDialog
        open={showRecurringDialog}
        onClose={onClose}
        title={t('recurring.confirmDialog.title')}
        content={t('recurring.confirmDialog.content')}
        actions={
          <>
            <Button
              theme="secondary"
              label={t('recurring.confirmDialog.decline')}
              onClick={handleOccasionalTrip}
            />
            <Button
              theme="primary"
              label={t('recurring.confirmDialog.confirm')}
              onClick={handleRecurringTrip}
            />
          </>
        }
      />
    )
  }
  return (
    <NestedSelectModal
      title={t('tripEdit.selectPurpose')}
      onClose={onClose}
      onSelect={handleSelect}
      isSelected={isSelected}
      options={makeOptions(t)}
    />
  )
}

export default React.memo(PurposeEditDialog)
