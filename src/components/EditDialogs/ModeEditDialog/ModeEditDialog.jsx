import React, { useCallback, useMemo, useState } from 'react'
import DialogDefaultMode from 'src/components/EditDialogs/DialogDefaultMode'
import { createGeojsonWithModifiedMode } from 'src/components/EditDialogs/ModeEditDialog/helpers'
import ModeOptionAction from 'src/components/EditDialogs/ModeOptionAction'
import { makeOptions } from 'src/components/EditDialogs/helpers'
import { useTrip } from 'src/components/Providers/TripProvider'
import { buildSettingsQuery } from 'src/queries/queries'

import { useClient, useQuery } from 'cozy-client'
import NestedSelectModal from 'cozy-ui/transpiled/react/NestedSelect/Modal'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const ModeEditDialog = ({ section, onClose }) => {
  const [defaultMode, setDefaultMode] = useState(null)
  const { t } = useI18n()
  const client = useClient()
  const { timeserie } = useTrip()
  const settingsQuery = buildSettingsQuery()
  const { data: settings } = useQuery(
    settingsQuery.definition,
    settingsQuery.options
  )

  const appSetting = useMemo(() => settings?.[0] || {}, [settings])
  const defaultModes = appSetting?.defaultTransportModeByGroup

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

  const handleActionClick = ({ item }) => {
    setDefaultMode(item)
  }
  const options = makeOptions(t, {
    defaultModes,
    action: {
      Component: ModeOptionAction,
      props: { onClick: handleActionClick }
    }
  })

  return (
    <>
      <NestedSelectModal
        title={t('tripEdit.selectMode')}
        onClose={onClose}
        onSelect={handleSelect}
        isSelected={isSelected}
        options={options}
        ellipsis={false}
      />
      {!!defaultMode && (
        <DialogDefaultMode
          item={defaultMode}
          onClose={() => setDefaultMode(null)}
          onConfirm={() => handleSelect(defaultMode)}
        />
      )}
    </>
  )
}

export default React.memo(ModeEditDialog)
