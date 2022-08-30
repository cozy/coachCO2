import React, { useMemo, useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate, useParams } from 'react-router-dom'

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
  getStartDate,
  getTimeseriePurpose,
  getFormattedDuration,
  getModesSortedByDistance,
  getFormattedDistance,
  getFormattedTotalCO2,
  computeAndFormatTotalCO2ByMode
} from 'src/lib/timeseries'
import { pickModeIcon } from 'src/components/helpers'
import TripDialogDesktop from 'src/components/Trip/TripDialogDesktop'

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
  const navigate = useNavigate()
  const { mode } = useParams()
  const { isMobile } = useBreakpoints()
  const [showTripDialog, setShowTripDialog] = useState(false)

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

  const handleClick = useCallback(() => {
    if (isMobile) {
      return navigate(`/trip/${timeserie._id}`)
    }
    setShowTripDialog(true)
  }, [navigate, isMobile, timeserie._id])

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
      {showTripDialog && (
        <TripDialogDesktop
          timeserieId={timeserie._id}
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

const MemoizedTripItem = React.memo(TripItem, (prevProps, nextProps) => {
  return prevProps.timeserie._rev === nextProps.timeserie._rev
})
MemoizedTripItem.displayName = 'MemoizedTripItem'

export default MemoizedTripItem
