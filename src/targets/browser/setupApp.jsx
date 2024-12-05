import { CaptureConsole } from '@sentry/integrations'
import * as Sentry from '@sentry/react'
import memoize from 'lodash/memoize'
import { createRoot } from 'react-dom/client'
import { CCO2_SETTINGS_DOCTYPE } from 'src/doctypes'
import { buildSettingsQuery } from 'src/queries/queries'
import { getValues } from 'src/utils/bar'
import { getClient } from 'src/utils/client'

import flag from 'cozy-flags'
import { RealtimePlugin } from 'cozy-realtime'
import { initTranslation } from 'cozy-ui/transpiled/react/providers/I18n'

import manifest from '../../../manifest.webapp'

// TODO: To be removed once we have handled the problem of having multiple data sources
/**
 * Force allSelected sources if a specific accountLogin is defined
 * @param  {import('cozy-client/types/CozyClient').default} client CozyClient
 */
const forceAllSelectedAccountToAppSettings = async client => {
  const { data: settings } = await client.query(buildSettingsQuery().definition)
  const setting = settings[0] || {}
  if (setting.accountLogin) {
    await client.save({
      ...setting,
      _type: CCO2_SETTINGS_DOCTYPE,
      accountLogin: null,
      isAllAccountsSelected: true
    })
  }
}

/**
 * Memoize this function in its own file so that it is correctly memoized
 */
const setupApp = memoize(() => {
  const container = document.querySelector('[role=application]')
  const root = createRoot(container)
  const { lang } = getValues(JSON.parse(container.dataset.cozy))
  const polyglot = initTranslation(lang, lang => require(`src/locales/${lang}`))
  const client = getClient()
  client.registerPlugin(flag.plugin)
  client.registerPlugin(RealtimePlugin)

  if (!flag('coachco2.forceAllSelectedAccount.disabled')) {
    forceAllSelectedAccountToAppSettings(client)
  }

  Sentry.init({
    dsn: 'https://9f18ae40b7a3ec801af8fcee845bca53@errors.cozycloud.cc/67',
    environment: process.env.NODE_ENV,
    release: manifest.version,
    integrations: [
      new CaptureConsole({ levels: ['error'] }), // We also want to capture the `console.error` to, among other things, report the logs present in the `try/catch`
      new Sentry.BrowserTracing()
    ],
    tracesSampleRate: 1,
    defaultIntegrations: false
  })

  return { root, client, lang, polyglot }
})

export default setupApp
