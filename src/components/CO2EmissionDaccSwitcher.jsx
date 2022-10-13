import React from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Switch from 'cozy-ui/transpiled/react/MuiCozyTheme/Switch'
import FormControlLabel from 'cozy-ui/transpiled/react/FormControlLabel'
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

const CO2EmissionDaccSwitcher = ({ className }) => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const classes = useStyles()

  const {
    isLoading,
    value = false,
    save
  } = useSettings('CO2Emission.sendToDACC')

  const handleChange = ev => {
    save(ev.target.checked)
  }

  return (
    <div className={className}>
      <FormControlLabel
        classes={classes}
        label={t('dacc.settings.anonymous_participation')}
        labelPlacement={isMobile ? 'start' : 'end'}
        checked={value}
        disabled={isLoading}
        onChange={handleChange}
        control={<Switch color="primary" />}
      />
    </div>
  )
}

export default CO2EmissionDaccSwitcher
