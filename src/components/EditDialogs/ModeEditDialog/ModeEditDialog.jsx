import React, { useCallback, useMemo } from 'react'
import { ModeAvatar } from 'src/components/Avatar'
import { createGeojsonWithModifiedMode } from 'src/components/EditDialogs/ModeEditDialog/helpers'
import { useTrip } from 'src/components/Providers/TripProvider'
import { modes } from 'src/components/helpers'

import { useClient } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import NestedSelectModal from 'cozy-ui/transpiled/react/NestedSelect/Modal'

const makeOptions = t => {
  const options = modes.map(mode => ({
    id: mode,
    title: t(`trips.modes.${mode}`),
    icon: <ModeAvatar attribute={mode} />
  }))

  return { children: options }
}

const ModeEditDialog = ({ section, onClose }) => {
  const { t } = useI18n()
  const client = useClient()
  const { timeserie } = useTrip()

  const handleSelect = useCallback(
    async item => {
      const newTimeserie = createGeojsonWithModifiedMode({
        timeserie,
        sectionId: section.id,
        mode: item.id
      })
      await client.save(newTimeserie)
      onClose()
    },
    [client, timeserie, onClose, section.id]
  )

  const isSelected = useMemo(
    () => item => item.id === section.mode,
    [section.mode]
  )

  return (
    <NestedSelectModal
      title={t('tripEdit.selectMode')}
      onClose={onClose}
      onSelect={handleSelect}
      isSelected={isSelected}
      options={makeOptions(t)}
    />
  )
}

export default React.memo(ModeEditDialog)
