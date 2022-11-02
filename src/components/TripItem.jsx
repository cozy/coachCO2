import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { useNavigate, useParams, useLocation } from 'react-router-dom'

import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import ListSubheader from 'cozy-ui/transpiled/react/MuiCozyTheme/ListSubheader'
import RightIcon from 'cozy-ui/transpiled/react/Icons/Right'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Typography from 'cozy-ui/transpiled/react/Typography'

import { PurposeAvatar } from 'src/components/Avatar'
import {
  getEndPlaceDisplayName,
  getStartDate,
  getTimeseriePurpose,
  getFormattedDuration,
  getModesSortedByDistance,
  getFormattedDistance,
  getFormattedTotalCO2,
  computeAndFormatTotalCO2ByMode
} from 'src/lib/timeseries'
import { pickModeIcon } from 'src/components/helpers'

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
  const location = useLocation()
  const navigate = useNavigate()
  const { mode } = useParams()

  const purpose = getTimeseriePurpose(timeserie)
  const duration = getFormattedDuration(timeserie)
  const modes = getModesSortedByDistance(timeserie)
  const distance = getFormattedDistance(timeserie)

  const formattedCO2 = useMemo(() => {
    if (mode) {
      return computeAndFormatTotalCO2ByMode(timeserie, mode)
    }
    return getFormattedTotalCO2(timeserie)
  }, [timeserie, mode])

  const tripModeIcons = useMemo(
    () => modes.map(mode => pickModeIcon(mode)),
    [modes]
  )

  const handleClick = () => {
    navigate(`${location.pathname}/${timeserie._id}`)
  }

  return (
    <>
      {hasDateHeader && (
        <ListSubheader>
          {f(getStartDate(timeserie), 'dddd DD MMMM')}
        </ListSubheader>
      )}
      <ListItem className="u-pl-1-s u-pl-2" button onClick={handleClick}>
        <ListItemIcon>
          <PurposeAvatar attribute={purpose} />
        </ListItemIcon>
        <ListItemText
          primary={getEndPlaceDisplayName(timeserie)}
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
        <Icon icon={RightIcon} color="var(--secondaryTextColor)" />
      </ListItem>
      <Divider />
    </>
  )
}

TripItem.propTypes = {
  timeserie: PropTypes.object.isRequired,
  hasDateHeader: PropTypes.bool.isRequired
}

const MemoizedTripItem = React.memo(TripItem, (prevProps, nextProps) => {
  return prevProps.timeserie._rev === nextProps.timeserie._rev
})
MemoizedTripItem.displayName = 'MemoizedTripItem'

export default MemoizedTripItem
