import React, { useCallback, useMemo } from 'react'

import { useClient } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import NestedSelectModal from 'cozy-ui/transpiled/react/NestedSelect/Modal'

import { modes } from 'src/components/helpers'
import { createGeojsonWithModifiedMode } from 'src/components/SectionEditDialog/helpers'
import Avatar from 'src/components/Avatar'
import { useTrip } from 'src/components/Trip/TripProvider'
import { pickModeIcon, modeToColor } from 'src/components/helpers'

const makeOptions = t => {
  const options = modes.map(mode => ({
    id: mode,
    title: t(`trips.modes.${mode}`),
    icon: <Avatar icon={pickModeIcon(mode)} color={modeToColor(mode)} faded />
  }))

  return { children: options }
}

const SectionEditDialog = ({ section, onClose }) => {
  const { t } = useI18n()
  const client = useClient()
  const { geojson } = useTrip()

  const handleSelect = useCallback(
    async item => {
      const geojsonWithModifiedMode = createGeojsonWithModifiedMode({
        geojson,
        sectionId: section.id,
        mode: item.id
      })
      await client.save(geojsonWithModifiedMode)
      onClose()
    },
    [client, geojson, onClose, section.id]
  )

  const isSelected = useMemo(() => item => item.id === section.mode, [
    section.mode
  ])

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

export default React.memo(SectionEditDialog)
