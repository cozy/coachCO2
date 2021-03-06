import React from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Switch from 'cozy-ui/transpiled/react/MuiCozyTheme/Switch'
import FormControlLabel from 'cozy-ui/transpiled/react/FormControlLabel'
import Typography from 'cozy-ui/transpiled/react/Typography'

import useSettings from 'src/hooks/useSettings'

const DaccAlerterSwitcher = props => {
  const { t } = useI18n()
  const { isLoading, value, save } = useSettings('hideDaccAlerter')

  const handleChange = ev => {
    save(ev.target.checked)
  }

  return (
    <div {...props}>
      <FormControlLabel
        className="u-ml-0"
        label={
          <Typography style={{ color: 'var(--infoColor)' }}>
            {t('dacc.settings.hideAlerter')}
          </Typography>
        }
        labelPlacement="start"
        checked={value}
        disabled={isLoading}
        onChange={handleChange}
        control={<Switch color="primary" />}
      />
    </div>
  )
}

export default DaccAlerterSwitcher
