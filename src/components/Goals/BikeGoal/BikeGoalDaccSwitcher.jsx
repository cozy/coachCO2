import React from 'react'
import useSettings from 'src/hooks/useSettings'

import FormControlLabel from 'cozy-ui/transpiled/react/FormControlLabel'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Switch from 'cozy-ui/transpiled/react/Switch'
import Typography from 'cozy-ui/transpiled/react/Typography'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
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

const BikeGoalDaccSwitcher = ({ className }) => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const classes = useStyles()

  const { isLoading, value, save } = useSettings('bikeGoal.sendToDACC')

  const handleChange = ev => {
    save(ev.target.checked)
  }

  return (
    <div className={className}>
      <FormControlLabel
        classes={classes}
        label={
          <Typography style={{ color: 'var(--infoColor)' }}>
            {t('bikeGoal.settings.sendToDACC')}
          </Typography>
        }
        labelPlacement={isMobile ? 'start' : 'end'}
        checked={!!value}
        disabled={isLoading}
        onChange={handleChange}
        control={<Switch color="primary" />}
      />
    </div>
  )
}

export default BikeGoalDaccSwitcher
