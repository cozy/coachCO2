import React, { useMemo, useState } from 'react'
import { PurposeAvatar } from 'src/components/Avatar'
import ContactToPlaceDialog from 'src/components/ContactToPlace/ContactToPlaceDialog'
import { openContactToPlaceModalOrClose } from 'src/components/EditDialogs/PurposeEditDialog/helpers'
import {
  handleOccasionalTrip,
  handleRecurringTrip
} from 'src/components/EditDialogs/helpers'
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

const PurposeEditDialog = ({ onSuccessMessage, onClose }) => {
  const [ContactToPlaceType, setContactToPlaceType] = useState()
  const [showRecurringDialog, setShowRecurringDialog] = useState(false)
  const [selectedPurpose, setSelectedPurpose] = useState(null)
  const { t } = useI18n()
  const client = useClient()
  const { timeserie } = useTrip()

  const handleSelect = async item => {
    setSelectedPurpose(item.id)
    setShowRecurringDialog(true)
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
                  setContactToPlaceType,
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
                  setContactToPlaceType,
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

  if (ContactToPlaceType) {
    return (
      <ContactToPlaceDialog
        type={ContactToPlaceType}
        onSuccessMessage={onSuccessMessage}
        onClose={onClose}
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
