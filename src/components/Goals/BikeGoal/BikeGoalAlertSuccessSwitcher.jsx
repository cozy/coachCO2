import React from 'react'
import useSettings from 'src/hooks/useSettings'

import Icon from 'cozy-ui/transpiled/react/Icon'
import CheckCircleIcon from 'cozy-ui/transpiled/react/Icons/CheckCircle'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Switch from 'cozy-ui/transpiled/react/Switch'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const styles = {
  ListItemText: { color: 'var(--infoColor)' }
}

const BikeGoalAlertSuccessSwitcher = () => {
  const { t } = useI18n()

  const { isLoading, value, save } = useSettings('bikeGoal.showAlertSuccess')

  const handleChange = val => {
    const value = val?.target?.checked ?? val
    save(value)
  }

  return (
    <ListItem
      button
      ellipsis={false}
      onClick={() => handleChange(!value)}
      disabled={isLoading}
    >
      <ListItemIcon>
        <Icon icon={CheckCircleIcon} color="var(--infoColor)" />
      </ListItemIcon>
      <ListItemText
        style={styles.ListItemText}
        primary={t('bikeGoal.settings.showAlerterSuccess')}
      />
      <ListItemSecondaryAction>
        <Switch checked={value} onChange={handleChange} />
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default BikeGoalAlertSuccessSwitcher
