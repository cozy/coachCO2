import React, { useCallback, useMemo } from 'react'

import { useClient } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import NestedSelectModal from 'cozy-ui/transpiled/react/NestedSelect/Modal'

import { purposes } from 'src/components/helpers'
import { createGeojsonWithModifiedPurpose } from 'src/components/EditDialogs/PurposeEditDialog/helpers'
import { PurposeAvatar } from 'src/components/Avatar'
import { useTrip } from 'src/components/Trip/TripProvider'
import { OTHER_PURPOSE } from 'src/constants/const'

const makeOptions = t => {
  const options = purposes.map(purpose => ({
    id: purpose,
    title: t(`trips.purposes.${purpose}`),
    icon: <PurposeAvatar purpose={purpose} />
  }))

  return { children: options }
}

const PurposeEditDialog = ({ onClose }) => {
  const { t } = useI18n()
  const client = useClient()
  const { geojson, trip } = useTrip()

  const handleSelect = useCallback(
    async item => {
      const newGeojson = createGeojsonWithModifiedPurpose({
        geojson,
        tripId: trip.id,
        purpose: item.id
      })
      await client.save(newGeojson)
      onClose()
    },
    [client, geojson, onClose, trip.id]
  )

  const isSelected = useMemo(
    () => item => {
      const manualPurpose = trip.properties.manual_purpose
      return manualPurpose
        ? item.id === manualPurpose
        : item.id === OTHER_PURPOSE
    },
    [trip.properties.manual_purpose]
  )

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
