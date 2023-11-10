import React, { useMemo } from 'react'
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
import NestedSelectModal from 'cozy-ui/transpiled/react/NestedSelect/Modal'
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
  const { t } = useI18n()
  const client = useClient()
  const { timeserie } = useTrip()
  const { type, setType } = useContactToPlace()

  const handleSelect = async item => {
    const oldPurpose = getTimeseriePurpose(timeserie)
    if (oldPurpose !== OTHER_PURPOSE) {
      await handleOccasionalTrip({ client, timeserie, purpose: item.id })
    } else {
      await handleRecurringTrip({
        client,
        timeserie,
        purpose: item.id,
        oldPurpose
      })
    }
    openContactToPlaceModalOrClose({
      timeserie,
      selectedPurpose: item.id,
      setContactToPlaceType: setType,
      onClose
    })
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
