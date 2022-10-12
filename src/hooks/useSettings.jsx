import get from 'lodash/get'
import set from 'lodash/set'
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
    ? undefined
    : settings && settings[0]
    ? get(settings[0], setting)
    : undefined

  const save = async value => {
    const newSettings = {
      ...settings[0],
      _type: SETTINGS_DOCTYPE
    }
    set(newSettings, setting, value)
    await client.save(newSettings)
  }

  return { isLoading, value, save }
}

export default useSettings
