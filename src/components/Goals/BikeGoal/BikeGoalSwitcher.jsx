import React from 'react'
import { useNavigate } from 'react-router-dom'
import useSettings from 'src/hooks/useSettings'

import Icon from 'cozy-ui/transpiled/react/Icon'
import BikeIcon from 'cozy-ui/transpiled/react/Icons/Bike'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Switch from 'cozy-ui/transpiled/react/Switch'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const BikeGoalSwitcher = () => {
  const { t } = useI18n()
  const navigate = useNavigate()

  const { isLoading: isOnboardedLoading, value: isOnboarded = false } =
    useSettings('bikeGoal.onboarded')
  const {
    isLoading: isActivatedLoading,
    value: isActivated = false,
    save: saveActivated
  } = useSettings('bikeGoal.activated')

  const isChecked = isOnboarded && isActivated
  const isLoading = isOnboardedLoading || isActivatedLoading

  const handleChange = async val => {
    const value = val?.target?.checked ?? val
    if (isOnboarded) {
      await saveActivated(value)
    } else {
      navigate('bikegoalonboarding')
    }
  }

  return (
    <ListItem
      button
      ellipsis={false}
      onClick={() => handleChange(!isChecked)}
      disabled={isLoading}
    >
      <ListItemIcon>
        <Icon icon={BikeIcon} />
      </ListItemIcon>
      <ListItemText primary={t('bikeGoal.settings.participation')} />
      <ListItemSecondaryAction>
        <Switch
          color="primary"
          edge="end"
          checked={isChecked}
          onChange={handleChange}
        />
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default BikeGoalSwitcher
