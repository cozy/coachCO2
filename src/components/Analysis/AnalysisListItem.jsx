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

import { PurposeAvatar, ModeAvatar } from 'src/components/Avatar'
import { formatCO2, computeFormatedPercentage } from 'src/lib/helpers'

const styles = {
  co2: { fontWeight: 700 }
}

const AvatarByType = {
  modes: ModeAvatar,
  purposes: PurposeAvatar
}

const ItemIcon = ({ type, sortedTimeserieKey }) => {
  const TypeAvatar = AvatarByType[type]

  return <TypeAvatar attribute={sortedTimeserieKey} />
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
        data-testid="ListItem"
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
          <Icon icon={RightIcon} color="var(--secondaryTextColor)" />
        )}
      </ListItem>
      <Divider />
    </>
  )
}

export default AnalysisListItem
