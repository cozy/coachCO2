import React, { useMemo, useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import get from 'lodash/get'

import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import ListSubheader from 'cozy-ui/transpiled/react/MuiCozyTheme/ListSubheader'
import RightIcon from 'cozy-ui/transpiled/react/Icons/Right'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Typography from 'cozy-ui/transpiled/react/Typography'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import { PurposeAvatar } from 'src/components/Avatar'
import {
  getEndPlaceDisplayName,
  getFormattedDuration,
  getModesSortedByDistance,
  formatTripDistance,
  getStartDate
} from 'src/lib/trips'
import { computeCO2Trip } from 'src/lib/metrics'
import { pickModeIcon } from 'src/components/helpers'
import TripDialogDesktop from 'src/components/Trip/TripDialogDesktop'
import { OTHER_PURPOSE } from 'src/constants/const'

const styles = {
  co2: { fontWeight: 700 },
  tripIcon: {
    marginRight: '4px'
  }
}

const TripItemSecondary = ({ tripModeIcons, duration, distance }) => {
  return (
    <>
      {tripModeIcons.map((tripModeIcon, idx) => (
        <Icon key={idx} icon={tripModeIcon} size={10} style={styles.tripIcon} />
      ))}
      {`· ${duration} · ${distance}`}
    </>
  )
}

export const TripItem = ({ geojson, trip, hasDateHeader }) => {
  const { f } = useI18n()
  const history = useHistory()
  const { isMobile } = useBreakpoints()
  const [showTripDialog, setShowTripDialog] = useState(false)

  const purpose = get(trip, 'properties.manual_purpose', OTHER_PURPOSE)
  const endPlace = useMemo(() => getEndPlaceDisplayName(trip), [trip])
  const duration = useMemo(() => getFormattedDuration(trip), [trip])
  const modes = useMemo(() => getModesSortedByDistance(trip), [trip])
  const distance = useMemo(() => formatTripDistance(trip), [trip])
  const day = useMemo(() => f(getStartDate(trip), 'dddd DD MMMM'), [f, trip])

  const CO2 = useMemo(() => {
    const CO2Trip = computeCO2Trip(trip)
    return Math.round(CO2Trip * 100) / 100
  }, [trip])

  const tripModeIcons = useMemo(() => modes.map(mode => pickModeIcon(mode)), [
    modes
  ])

  const handleClick = useCallback(() => {
    if (isMobile) {
      return history.push(`/trip/${trip.geojsonId}`)
    }
    setShowTripDialog(true)
  }, [history, isMobile, trip.geojsonId])

  return (
    <>
      {hasDateHeader && <ListSubheader>{day}</ListSubheader>}
      <ListItem className="u-pl-1-s u-pl-2" button onClick={handleClick}>
        <ListItemIcon>
          <PurposeAvatar purpose={purpose} />
        </ListItemIcon>
        <ListItemText
          primary={endPlace}
          secondary={
            <TripItemSecondary
              tripModeIcons={tripModeIcons}
              duration={duration}
              distance={distance}
            />
          }
        />
        <Typography className="u-mh-half" style={styles.co2} variant="body2">
          {CO2}&nbsp;kg
        </Typography>
        <Icon icon={RightIcon} color={'var(--secondaryTextColor)'} />
      </ListItem>
      <Divider />
      {showTripDialog && (
        <TripDialogDesktop
          geojson={geojson}
          trip={trip}
          setShowTripDialog={setShowTripDialog}
        />
      )}
    </>
  )
}

TripItem.propTypes = {
  trip: PropTypes.object.isRequired,
  hasDateHeader: PropTypes.bool.isRequired
}

export default TripItem
