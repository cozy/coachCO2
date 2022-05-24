import React from 'react'

import { isQueryLoading, useClient, useQuery } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Label from 'cozy-ui/transpiled/react/Label'
import Switch from 'cozy-ui/transpiled/react/MuiCozyTheme/Switch'
import FormControlLabel from 'cozy-ui/transpiled/react/FormControlLabel'

import { SETTINGS_DOCTYPE } from 'src/doctypes'
import { buildSettingsQuery } from 'src/queries/queries'

const DaccSwitcher = props => {
  const { t } = useI18n()
  const client = useClient()

  const settingsQuery = buildSettingsQuery()
  const { data: settings, ...settingsQueryLeft } = useQuery(
    settingsQuery.definition,
    settingsQuery.options
  )
  const isLoading = isQueryLoading(settingsQueryLeft)

  const handleChange = ev => {
    client.save({
      ...settings[0],
      _type: SETTINGS_DOCTYPE,
      allowSendDataToDacc: ev.target.checked
    })
  }

  return (
    <div {...props}>
      <Label>{t('dacc.settings.label')}</Label>
      <FormControlLabel
        className="u-ml-0"
        label={t('dacc.settings.anonymous_participation')}
        labelPlacement="start"
        checked={settings[0]?.allowSendDataToDacc}
        disabled={isLoading}
        onChange={handleChange}
        control={<Switch color="primary" />}
      />
    </div>
  )
}

export default DaccSwitcher
