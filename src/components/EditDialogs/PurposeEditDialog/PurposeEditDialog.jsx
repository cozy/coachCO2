import React, { useCallback, useMemo } from 'react'

import { useClient } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import NestedSelectModal from 'cozy-ui/transpiled/react/NestedSelect/Modal'

import { purposes } from 'src/components/helpers'
import { createGeojsonWithModifiedPurpose } from 'src/components/EditDialogs/PurposeEditDialog/helpers'
import { PurposeAvatar } from 'src/components/Avatar'
import { useTrip } from 'src/components/Providers/TripProvider'
import { OTHER_PURPOSE, RECURRING_PURPOSES_SERVICE_NAME } from 'src/constants'
import { getGeoJSONData, getTimeseriePurpose } from 'src/lib/timeseries'
import { startService } from 'src/lib/services'

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

  const handleSelect = useCallback(
    async item => {
      const oldPurpose = getTimeseriePurpose(timeserie)
      const newTimeserie = createGeojsonWithModifiedPurpose({
        timeserie,
        tripId: getGeoJSONData(timeserie).id,
        purpose: item.id
      })
      await client.save(newTimeserie)
      // Start service to set the purpose to similar trips
      startService(client, RECURRING_PURPOSES_SERVICE_NAME, {
        fields: {
          docId: newTimeserie._id,
          oldPurpose
        }
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
