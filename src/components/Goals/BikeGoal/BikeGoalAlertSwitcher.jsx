import React from 'react'
import useSettings from 'src/hooks/useSettings'

import FormControlLabel from 'cozy-ui/transpiled/react/FormControlLabel'
import Switch from 'cozy-ui/transpiled/react/Switch'
import Typography from 'cozy-ui/transpiled/react/Typography'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

const useStyles = makeStyles(() => ({
  root: {
    marginLeft: 0
  },
  labelPlacementStart: {
    display: 'flex',
    justifyContent: 'space-between'
  }
}))

const BikeGoalAlertSwitcher = ({ className }) => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const classes = useStyles()

  const { isLoading, value = true, save } = useSettings('bikeGoal.showAlert')

  const handleChange = ev => {
    save(ev.target.checked)
  }

  return (
    <div className={className}>
      <FormControlLabel
        classes={classes}
        label={
          <Typography style={{ color: 'var(--infoColor)' }}>
            {t('bikeGoal.settings.showAlerter')}
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

export default BikeGoalAlertSwitcher
