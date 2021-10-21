import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import Icon from 'cozy-ui/transpiled/react/Icon'
import CarIcon from 'cozy-ui/transpiled/react/Icons/Car'
import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import GeoCard from 'src/components/GeoCard'
import {
  getEndPlaceDisplayName,
  getFormattedDuration,
  getModes,
  formatDistance
} from './trips'

export const TripItem = ({ trip }) => {
  const { t } = useI18n()

  const endPlace = useMemo(() => getEndPlaceDisplayName(trip), [trip])
  const duration = useMemo(() => getFormattedDuration(trip), [trip])
  const modes = useMemo(() => getModes(trip), [trip])
  const distance = useMemo(() => formatDistance(trip), [trip])

  const tripDetails = useMemo(() => {
    const tModes = modes.map(m => t(`trips.modes.${m}`)).join(', ')
    return `${duration} · ${tModes}`
  }, [duration, modes, t])

  const openMap = () => {
     // TODO: open GeoCard in dialog
    // return <GeoCard trip={trip} loading={false} /> 
  }

  return (
    <>
      <ListItem button onClick={() => openMap()}>
        <ListItemIcon>
          <Icon icon={CarIcon} width="32" height="32" />
        </ListItemIcon>
        <ListItemText primary={endPlace} secondary={tripDetails} />
        <ListItemText primary={distance} />
      </ListItem>
      <Divider variant="inset" />
    </>
  )
}

TripItem.propTypes = {
  trip: PropTypes.object.isRequired
}

export default TripItem
