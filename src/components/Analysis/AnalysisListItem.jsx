import React from 'react'
import { useHistory } from 'react-router-dom'

import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Typography from 'cozy-ui/transpiled/react/Typography'
import RightIcon from 'cozy-ui/transpiled/react/Icons/Right'
import Icon from 'cozy-ui/transpiled/react/Icon'

import Avatar from 'src/components/Avatar'
import {
  pickModeIcon,
  modeToColor,
  pickPurposeIcon,
  purposeToColor
} from 'src/components/helpers'
import { computeFormatedPercentage, formatCO2 } from 'src/lib/trips'

const styles = {
  co2: { fontWeight: 700 }
}

const ItemIcon = ({ type, sortedTimeserieKey }) => {
  if (type === 'modes') {
    return (
      <Avatar
        icon={pickModeIcon(sortedTimeserieKey)}
        color={modeToColor(sortedTimeserieKey)}
      />
    )
  }

  return (
    <Avatar
      icon={pickPurposeIcon(sortedTimeserieKey)}
      color={purposeToColor(sortedTimeserieKey)}
    />
  )
}

const AnalysisListItem = ({ sortedTimeserie, totalCO2, type }) => {
  const { t } = useI18n()
  const history = useHistory()
  const [sortedTimeserieKey, sortedTimeserieValue] = sortedTimeserie
  const travelCount = sortedTimeserieValue.timeseries.length
  const CO2 = sortedTimeserieValue.totalCO2

  const CO2percent = computeFormatedPercentage(CO2, totalCO2)
  const isDisabled = travelCount === 0 && CO2 === 0

  const handleClick = () => {
    return history.push(`/analysis/${type}/${sortedTimeserieKey}`)
  }

  return (
    <>
      <ListItem
        className="u-pl-1-s u-pl-2"
        disabled={isDisabled}
        onClick={!isDisabled ? handleClick : undefined}
        button
      >
        <ListItemIcon>
          <ItemIcon type={type} sortedTimeserieKey={sortedTimeserieKey} />
        </ListItemIcon>
        <ListItemText
          primary={t(`trips.${type}.${sortedTimeserieKey}`)}
          secondary={`${CO2percent} · ${t('analysis.travels', travelCount)}`}
        />
        <Typography className="u-mh-half" style={styles.co2} variant="body2">
          {formatCO2(CO2)}
        </Typography>
        {!isDisabled && (
          <Icon icon={RightIcon} color={'var(--secondaryTextColor)'} />
        )}
      </ListItem>
      <Divider />
    </>
  )
}

export default AnalysisListItem
