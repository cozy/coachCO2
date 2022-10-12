import React from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Switch from 'cozy-ui/transpiled/react/MuiCozyTheme/Switch'
import FormControlLabel from 'cozy-ui/transpiled/react/FormControlLabel'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import useSettings from 'src/hooks/useSettings'

const useStyles = makeStyles(() => ({
  root: {
    marginLeft: 0
  },
  labelPlacementStart: {
    display: 'flex',
    justifyContent: 'space-between'
  }
}))

const CO2EmissionDaccAlertSwitcher = props => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const classes = useStyles()

  const { isLoading, value = true, save } = useSettings('CO2Emission.showAlert')

  const handleChange = ev => {
    save(ev.target.checked)
  }

  return (
    <div {...props}>
      <FormControlLabel
        classes={classes}
        label={
          <Typography style={{ color: 'var(--infoColor)' }}>
            {t('dacc.settings.showAlerter')}
          </Typography>
        }
        labelPlacement={isMobile ? 'start' : 'end'}
        checked={value}
        disabled={isLoading}
        onChange={handleChange}
        control={<Switch color="primary" />}
      />
    </div>
  )
}

export default CO2EmissionDaccAlertSwitcher
