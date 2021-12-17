import React, { useCallback } from 'react'

import { useClient } from 'cozy-client'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemSecondaryAction'
import Radio from 'cozy-ui/transpiled/react/Radio'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import { createGeojsonWithModifiedMode } from 'src/components/SectionEditModal/helpers'
import { useTrip } from 'src/components/Trip/TripProvider'
import ModeIcon from 'src/components/ModeIcon'

const ModeItem = ({ mode, section, closeModal }) => {
  const { geojson } = useTrip()
  const client = useClient()
  const { t } = useI18n()
  const isSelected = mode === section.mode

  const changeMode = useCallback(
    mode => async () => {
      const geojsonWithModifiedMode = createGeojsonWithModifiedMode({
        geojson,
        sectionId: section.id,
        mode
      })
      await client.save(geojsonWithModifiedMode)
      closeModal()
    },
    [client, closeModal, geojson, section.id]
  )

  return (
    <ListItem button onClick={changeMode(mode)}>
      <ListItemIcon>
        <ModeIcon mode={mode} faded />
      </ListItemIcon>
      <ListItemText primary={t(`trips.modes.${mode}`)} />
      <ListItemSecondaryAction className="u-flex u-flex-row">
        <Radio defaultChecked={isSelected} onChange={changeMode(mode)} />
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default React.memo(ModeItem)
