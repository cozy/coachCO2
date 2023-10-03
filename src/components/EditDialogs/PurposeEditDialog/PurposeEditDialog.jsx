import React, { useMemo, useState } from 'react'
import { PurposeAvatar } from 'src/components/Avatar'
import ContactToPlaceDialog from 'src/components/ContactToPlace/ContactToPlaceDialog'
import { openContactToPlaceModalOrClose } from 'src/components/EditDialogs/PurposeEditDialog/helpers'
import {
  handleOccasionalTrip,
  handleRecurringTrip
} from 'src/components/EditDialogs/helpers'
import { useContactToPlace } from 'src/components/Providers/ContactToPlaceProvider'
import { useTrip } from 'src/components/Providers/TripProvider'
import { purposes } from 'src/components/helpers'
import { OTHER_PURPOSE } from 'src/constants'
import { getTimeseriePurpose } from 'src/lib/timeseries'

import { useClient } from 'cozy-client'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import NestedSelectModal from 'cozy-ui/transpiled/react/NestedSelect/Modal'
import { Button } from 'cozy-ui/transpiled/react/deprecated/Button'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

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
  const { type, setType } = useContactToPlace()

  const handleSelect = async item => {
    setSelectedPurpose(item.id)
    const oldPurpose = getTimeseriePurpose(timeserie)

    if (oldPurpose !== OTHER_PURPOSE) {
      setShowRecurringDialog(true)
    } else {
      await handleRecurringTrip({
        client,
        timeserie,
        purpose: item.id,
        oldPurpose
      })
      onClose()
    }
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
        open
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
                openContactToPlaceModalOrClose({
                  timeserie,
                  selectedPurpose,
                  setContactToPlaceType: setType,
                  setShowRecurringDialog,
                  onClose
                })
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
                openContactToPlaceModalOrClose({
                  timeserie,
                  selectedPurpose,
                  setContactToPlaceType: setType,
                  setShowRecurringDialog,
                  onClose
                })
              }}
            />
          </>
        }
        onClose={onClose}
      />
    )
  }

  if (type) {
    return <ContactToPlaceDialog onClose={onClose} />
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
