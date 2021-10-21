import React, { useMemo, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemSecondaryAction'
import CarIcon from 'cozy-ui/transpiled/react/Icons/Car'
import RightIcon from 'cozy-ui/transpiled/react/Icons/Right'
import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'

import MainModeIcon from 'src/components/MainModeIcon'
import GeoCard from 'src/components/GeoCard'
import {
  getEndPlaceDisplayName,
  getFormattedDuration,
  getModes,
  formatDistance
} from './trips'

export const TripItem = ({ trip }) => {
  const { t } = useI18n()
  const [shouldOpenMap, setShouldOpenMap] = useState(false)

  const endPlace = useMemo(() => getEndPlaceDisplayName(trip), [trip])
  const duration = useMemo(() => getFormattedDuration(trip), [trip])
  const modes = useMemo(() => getModes(trip), [trip])
  const distance = useMemo(() => formatDistance(trip), [trip])

  const tripDetails = useMemo(() => {
    const tModes = modes.map(m => t(`trips.modes.${m}`)).join(', ')
    return `${duration} · ${tModes} · ${distance}`
  }, [duration, modes, t, distance])

  const toggleOpenMap = useCallback(() => {
    setShouldOpenMap(!shouldOpenMap)
  }, [setShouldOpenMap, shouldOpenMap])

  return (
    <>
      <Dialog
        title="Nice trip"
        open={shouldOpenMap}
        onClose={toggleOpenMap}
        content={<GeoCard trip={trip} loading={false} />}
      ></Dialog>
      <ListItem button onClick={toggleOpenMap}>
        <ListItemIcon>
          <MainModeIcon trip={trip} />
        </ListItemIcon>
        <ListItemText primary={endPlace} secondary={tripDetails} />
        <ListItemSecondaryAction>
          <Icon icon={RightIcon} color="var(--secondaryTextColor)" />
        </ListItemSecondaryAction>
      </ListItem>
      <Divider variant="inset" />
    </>
  )
}
//<Icon icon={CarIcon} color="orange" />
TripItem.propTypes = {
  trip: PropTypes.object.isRequired
}

export default TripItem
