import React, { useCallback, useMemo, useState } from 'react'

import { useClient } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import NestedSelectModal from 'cozy-ui/transpiled/react/NestedSelect/Modal'

import { purposes } from 'src/components/helpers'
import { PurposeAvatar } from 'src/components/Avatar'
import { useTrip } from 'src/components/Providers/TripProvider'
import { OTHER_PURPOSE } from 'src/constants'
import { getTimeseriePurpose } from 'src/lib/timeseries'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { Button } from 'cozy-ui/transpiled/react/Button'
import {
  handleOccasionalTrip,
  handleRecurringTrip
} from 'src/components/EditDialogs/helpers'

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
      handleRecurringTrip({
        client,
        timeserie,
        purpose: item.id,
        oldPurpose
      })
      onClose()
    },
    [client, timeserie, onClose]
  )

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
              onClick={async () => {
                await handleOccasionalTrip({
                  client,
                  timeserie,
                  purpose: selectedPurpose
                })
                onClose()
              }}
            />
            <Button
              theme="primary"
              label={t('recurring.confirmDialog.confirm')}
              onClick={async () => {
                await handleRecurringTrip({
                  client,
                  timeserie,
                  purpose: selectedPurpose,
                  oldPurpose: getTimeseriePurpose(timeserie)
                })
                onClose()
              }}
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
