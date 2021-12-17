import React, { useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'

import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import ListSubheader from 'cozy-ui/transpiled/react/MuiCozyTheme/ListSubheader'
import RightIcon from 'cozy-ui/transpiled/react/Icons/Right'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Typography from 'cozy-ui/transpiled/react/Typography'

import MainModeIcon from 'src/components/MainModeIcon'
import {
  getEndPlaceDisplayName,
  getFormattedDuration,
  getModes,
  formatTripDistance,
  getStartDate
} from 'src/lib/trips'
import { computeCO2Trip } from 'src/lib/metrics'

const styles = {
  co2: { fontWeight: 700 }
}

export const TripItem = ({ trip, withDateHeader }) => {
  const { f, t } = useI18n()
  const history = useHistory()

  const endPlace = useMemo(() => getEndPlaceDisplayName(trip), [trip])
  const duration = useMemo(() => getFormattedDuration(trip), [trip])
  const modes = useMemo(() => getModes(trip), [trip])
  const distance = useMemo(() => formatTripDistance(trip), [trip])
  const day = useMemo(() => f(getStartDate(trip), 'dddd DD MMMM'), [f, trip])

  const CO2 = useMemo(() => {
    const CO2Trip = computeCO2Trip(trip)
    return Math.round(CO2Trip * 100) / 100
  }, [trip])

  const tripDetails = useMemo(() => {
    const tModes = modes.map(m => t(`trips.modes.${m}`)).join(', ')
    return `${duration} · ${distance} · ${tModes} `
  }, [duration, modes, t, distance])

  const goToTrip = useCallback(() => {
    history.push(`/trip/${trip.geojsonId}`)
  }, [history, trip.geojsonId])

  return (
    <>
      {withDateHeader ? <ListSubheader>{day}</ListSubheader> : null}
      <ListItem button onClick={goToTrip}>
        <ListItemIcon>
          <MainModeIcon trip={trip} />
        </ListItemIcon>
        <ListItemText primary={endPlace} secondary={tripDetails} />
        <Typography className="u-mh-half" style={styles.co2} variant="body2">
          {CO2}&nbsp;kg
        </Typography>
        <Icon icon={RightIcon} className="u-coolGrey" />
      </ListItem>
      <Divider variant="inset" />
    </>
  )
}
TripItem.propTypes = {
  trip: PropTypes.object.isRequired,
  withDateHeader: PropTypes.bool.isRequired
}

export default TripItem
