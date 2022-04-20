import React, { useCallback, useMemo } from 'react'

import { useClient } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import NestedSelectModal from 'cozy-ui/transpiled/react/NestedSelect/Modal'

import { purposes } from 'src/components/helpers'
import { createGeojsonWithModifiedPurpose } from 'src/components/EditDialogs/PurposeEditDialog/helpers'
import { PurposeAvatar } from 'src/components/Avatar'
import { useTrip } from 'src/components/Providers/TripProvider'
import { OTHER_PURPOSE } from 'src/constants'
import { getGeoJSONData, getManualPurpose } from 'src/lib/timeseries'

const makeOptions = t => {
  const options = purposes.map(purpose => ({
    id: purpose,
    title: t(`trips.purposes.${purpose.toUpperCase()}`),
    icon: <PurposeAvatar attribute={purpose} />
  }))

  return { children: options }
}

const PurposeEditDialog = ({ onClose }) => {
  const { t } = useI18n()
  const client = useClient()
  const { timeserie } = useTrip()

  const handleSelect = useCallback(
    async item => {
      const newTimeserie = createGeojsonWithModifiedPurpose({
        timeserie,
        tripId: getGeoJSONData(timeserie).id,
        purpose: item.id
      })
      await client.save(newTimeserie)
      onClose()
    },
    [client, timeserie, onClose]
  )

  const isSelected = useMemo(
    () => item => {
      const manualPurpose = getManualPurpose(timeserie)
      return manualPurpose
        ? item.id === manualPurpose
        : item.id === OTHER_PURPOSE
    },
    [timeserie]
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
