import React from 'react'

import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Typography from 'cozy-ui/transpiled/react/Typography'

import Avatar from 'src/components/Avatar'
import { pickModeIcon, modeToColor } from 'src/components/helpers'
import { formatCO2 } from 'src/lib/trips'

const styles = {
  co2: { fontWeight: 700 }
}

const ModeItem = ({ timeseriesSortedByMode, totalCO2 }) => {
  const { t } = useI18n()
  const mode = timeseriesSortedByMode[0]
  const value = timeseriesSortedByMode[1]
  const travelCount = value.timeseries.length
  const CO2 = value.totalCO2

  const CO2percent = `${Math.round((CO2 * 100) / totalCO2)}%`
  const isDisabled = travelCount === 0 && CO2 === 0

  return (
    <>
      <ListItem className="u-pl-1-s u-pl-2" disabled={isDisabled}>
        <ListItemIcon>
          <Avatar icon={pickModeIcon(mode)} color={modeToColor(mode)} />
        </ListItemIcon>
        <ListItemText
          primary={t(`trips.modes.${mode}`)}
          secondary={`${CO2percent} · ${t('analysis.travels', travelCount)}`}
        />
        <Typography className="u-mh-half" style={styles.co2} variant="body2">
          {formatCO2(CO2)}
        </Typography>
      </ListItem>
      <Divider />
    </>
  )
}

export default ModeItem
