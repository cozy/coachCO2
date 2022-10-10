import React from 'react'

import Switch from 'cozy-ui/transpiled/react/MuiCozyTheme/Switch'
import FormControlLabel from 'cozy-ui/transpiled/react/FormControlLabel'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import useSettings from 'src/hooks/useSettings'

const BikeGoalAlertSwitcher = () => {
  const { t } = useI18n()
  const { isLoading, value, save } = useSettings('hideObjectivesAlerter')

  const handleChange = ev => {
    save(ev.target.checked)
  }

  return (
    <FormControlLabel
      className="u-ml-0"
      label={
        <Typography style={{ color: 'var(--infoColor)' }}>
          {t('bikeGoal.settings.hideAlerter')}
        </Typography>
      }
      labelPlacement="start"
      checked={value}
      disabled={isLoading}
      onChange={handleChange}
      control={<Switch color="primary" />}
    />
  )
}

export default BikeGoalAlertSwitcher
