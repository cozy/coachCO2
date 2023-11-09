import React from 'react'
import useSettings from 'src/hooks/useSettings'

import Icon from 'cozy-ui/transpiled/react/Icon'
import LightbulbIcon from 'cozy-ui/transpiled/react/Icons/Lightbulb'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Switch from 'cozy-ui/transpiled/react/Switch'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const styles = {
  ListItemText: { color: 'var(--infoColor)' }
}

const BikeGoalAlertSwitcher = () => {
  const { t } = useI18n()

  const { isLoading, value = true, save } = useSettings('bikeGoal.showAlert')

  const handleChange = val => {
    const value = val?.target?.checked ?? val
    save(value)
  }

  return (
    <ListItem
      button
      gutters="disabled"
      ellipsis={false}
      onClick={() => handleChange(!value)}
      disabled={isLoading}
    >
      <ListItemIcon>
        <Icon icon={LightbulbIcon} color="var(--infoColor)" />
      </ListItemIcon>
      <ListItemText
        style={styles.ListItemText}
        primary={t('bikeGoal.settings.showAlerter')}
      />
      <ListItemSecondaryAction>
        <Switch edge="end" checked={value} onChange={handleChange} />
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default BikeGoalAlertSwitcher
