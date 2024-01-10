import React from 'react'
import useSettings from 'src/hooks/useSettings'

import Icon from 'cozy-ui/transpiled/react/Icon'
import GrowthIcon from 'cozy-ui/transpiled/react/Icons/Growth'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Switch from 'cozy-ui/transpiled/react/Switch'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const CO2EmissionDaccCVLSwitcher = () => {
  const { t } = useI18n()

  const {
    isLoading,
    value = false,
    save
  } = useSettings('centreValDeLoireExpe.sendToDACC')

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
        <Icon icon={GrowthIcon} />
      </ListItemIcon>
      <ListItemText primary={t('centreValDeLoireExpe.settings.sendToDACC')} />
      <ListItemSecondaryAction>
        <Switch color="primary" checked={value} onChange={handleChange} />
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default CO2EmissionDaccCVLSwitcher
