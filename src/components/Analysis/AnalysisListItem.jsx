import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PurposeAvatar, ModeAvatar } from 'src/components/Avatar'
import { formatCO2, computeFormatedPercentage } from 'src/lib/helpers'

import Divider from 'cozy-ui/transpiled/react/Divider'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import RightIcon from 'cozy-ui/transpiled/react/Icons/Right'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Typography from 'cozy-ui/transpiled/react/Typography'

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
  const navigate = useNavigate()
  const [sortedTimeserieKey, sortedTimeserieValue] = sortedTimeserie
  const travelCount = sortedTimeserieValue.timeseries.length
  const CO2 = sortedTimeserieValue.totalCO2

  const CO2percent = computeFormatedPercentage(CO2, totalCO2)
  const isDisabled = travelCount === 0 && CO2 === 0

  const handleClick = () => {
    return navigate(`/analysis/${type}/${sortedTimeserieKey}`)
  }

  return (
    <>
      <ListItem
        data-testid="ListItem"
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
        <Typography style={styles.co2} variant="body2">
          {formatCO2(CO2)}
        </Typography>
        {!isDisabled && (
          <ListItemIcon>
            <Icon icon={RightIcon} color="var(--secondaryTextColor)" />
          </ListItemIcon>
        )}
      </ListItem>
      <Divider />
    </>
  )
}

export default AnalysisListItem
