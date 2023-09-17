import PropTypes from 'prop-types'
import React, { useMemo } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { PurposeAvatar } from 'src/components/Avatar'
import { pickModeIcon } from 'src/components/helpers'
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

import Divider from 'cozy-ui/transpiled/react/Divider'
import Icon from 'cozy-ui/transpiled/react/Icon'
import RightIcon from 'cozy-ui/transpiled/react/Icons/Right'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListSubheader from 'cozy-ui/transpiled/react/ListSubheader'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const styles = {
  co2: {
    fontWeight: 700,
    whiteSpace: 'nowrap',
    marginRight: '-1rem'
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
      <ListItem button onClick={handleClick}>
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
        <Typography style={styles.co2} variant="body2">
          {formattedCO2}
        </Typography>
        <ListItemIcon>
          <Icon icon={RightIcon} color="var(--secondaryTextColor)" />
        </ListItemIcon>
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
