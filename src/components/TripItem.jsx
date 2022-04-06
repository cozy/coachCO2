import React, { useMemo, useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { useHistory, useParams } from 'react-router-dom'
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
  getFormattedTripDistance,
  getTripStartDate,
  computeAndFormatCO2Trip,
  computeAndFormatCO2TripByMode
} from 'src/lib/trips'
import { transformTimeseriesToTrips } from 'src/lib/timeseries'
import { pickModeIcon } from 'src/components/helpers'
import TripDialogDesktop from 'src/components/Trip/TripDialogDesktop'
import { OTHER_PURPOSE } from 'src/constants'

const styles = {
  co2: {
    fontWeight: 700,
    whiteSpace: 'nowrap'
  },
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

export const TripItem = ({ timeserie, hasDateHeader }) => {
  const { f } = useI18n()
  const history = useHistory()
  const { mode } = useParams()
  const { isMobile } = useBreakpoints()
  const [showTripDialog, setShowTripDialog] = useState(false)
  const trip = useCallback(transformTimeseriesToTrips([timeserie])[0], [
    timeserie
  ])

  const purpose = get(trip, 'properties.manual_purpose', OTHER_PURPOSE)
  const endPlace = useMemo(() => getEndPlaceDisplayName(trip), [trip])
  const duration = useMemo(() => getFormattedDuration(trip), [trip])
  const modes = useMemo(() => getModesSortedByDistance(trip), [trip])
  const distance = useMemo(() => getFormattedTripDistance(trip), [trip])
  const day = useMemo(() => f(getTripStartDate(trip), 'dddd DD MMMM'), [
    f,
    trip
  ])

  const formattedCO2 = useMemo(() => {
    if (mode) {
      return computeAndFormatCO2TripByMode(trip, mode)
    }
    return computeAndFormatCO2Trip(trip)
  }, [mode, trip])

  const tripModeIcons = useMemo(() => modes.map(mode => pickModeIcon(mode)), [
    modes
  ])

  const handleClick = useCallback(() => {
    if (isMobile) {
      return history.push(`/trip/${trip.timeserieId}`)
    }
    setShowTripDialog(true)
  }, [history, isMobile, trip.timeserieId])

  return (
    <>
      {hasDateHeader && <ListSubheader>{day}</ListSubheader>}
      <ListItem className="u-pl-1-s u-pl-2" button onClick={handleClick}>
        <ListItemIcon>
          <PurposeAvatar attribute={purpose} />
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
          {formattedCO2}
        </Typography>
        <Icon icon={RightIcon} color={'var(--secondaryTextColor)'} />
      </ListItem>
      <Divider />
      {showTripDialog && (
        <TripDialogDesktop
          timeserie={timeserie}
          trip={trip}
          setShowTripDialog={setShowTripDialog}
        />
      )}
    </>
  )
}

TripItem.propTypes = {
  timeserie: PropTypes.object.isRequired,
  hasDateHeader: PropTypes.bool.isRequired
}

export default TripItem
