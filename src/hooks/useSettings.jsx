import { isQueryLoading, useClient, useQuery } from 'cozy-client'

import { SETTINGS_DOCTYPE } from 'src/doctypes'
import { buildSettingsQuery } from 'src/queries/queries'

const useSettings = setting => {
  const client = useClient()

  const settingsQuery = buildSettingsQuery()
  const { data: settings, ...settingsQueryLeft } = useQuery(
    settingsQuery.definition,
    settingsQuery.options
  )
  const isLoading = isQueryLoading(settingsQueryLeft)

  const value = isLoading
    ? null
    : settings && settings[0]
    ? settings[0][setting]
    : null

  const save = value => {
    client.save({
      ...settings[0],
      _type: SETTINGS_DOCTYPE,
      [setting]: value
    })
  }

  return { isLoading, value, save }
}

export default useSettings
