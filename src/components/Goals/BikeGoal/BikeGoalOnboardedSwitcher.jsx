import React from 'react'
import useSettings from 'src/hooks/useSettings'

import Icon from 'cozy-ui/transpiled/react/Icon'
import EyeClosedIcon from 'cozy-ui/transpiled/react/Icons/EyeClosed'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Switch from 'cozy-ui/transpiled/react/Switch'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const styles = {
  ListItemText: { color: 'var(--infoColor)' }
}

const BikeGoalOnboardedSwitcher = () => {
  const { t } = useI18n()

  const {
    isLoading: isOnboardedLoading,
    value: isOnboarded = false,
    save: saveOnboarded
  } = useSettings('bikeGoal.onboarded')
  const {
    isLoading: isActivatedLoading,
    value: isActivated = false,
    save: saveActivated
  } = useSettings('bikeGoal.activated')

  const isChecked = isOnboarded || isActivated
  const isLoading = isOnboardedLoading || isActivatedLoading

  const handleChange = async val => {
    const value = val?.target?.checked ?? val
    if (isActivated) {
      await saveActivated(value)
    }
    await saveOnboarded(value)
  }

  return (
    <ListItem
      button
      ellipsis={false}
      onClick={() => handleChange(!isChecked)}
      disabled={isLoading}
    >
      <ListItemIcon>
        <Icon icon={EyeClosedIcon} color="var(--infoColor)" />
      </ListItemIcon>
      <ListItemText
        style={styles.ListItemText}
        primary={t('bikeGoal.settings.hideOnboarding')}
      />
      <ListItemSecondaryAction>
        <Switch checked={isChecked} onChange={handleChange} />
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default BikeGoalOnboardedSwitcher
