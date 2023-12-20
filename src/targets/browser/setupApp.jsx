import { CaptureConsole } from '@sentry/integrations'
import * as Sentry from '@sentry/react'
import memoize from 'lodash/memoize'
import { getValues, initBar } from 'src/utils/bar'
import { getClient } from 'src/utils/client'

import flag from 'cozy-flags'
import { RealtimePlugin } from 'cozy-realtime'
import { initTranslation } from 'cozy-ui/transpiled/react/providers/I18n'

import manifest from '../../../manifest.webapp'

/**
 * Memoize this function in its own file so that it is correctly memoized
 */
const setupApp = memoize(() => {
  const container = document.querySelector('[role=application]')
  const { lang, appName } = getValues(JSON.parse(container.dataset.cozy))
  const polyglot = initTranslation(lang, lang => require(`locales/${lang}`))
  const client = getClient()
  client.registerPlugin(flag.plugin)
  client.registerPlugin(RealtimePlugin)

  Sentry.init({
    dsn: 'https://9f18ae40b7a3ec801af8fcee845bca53@errors.cozycloud.cc/67',
    environment: process.env.NODE_ENV,
    release: manifest.version,
    integrations: [
      new CaptureConsole({ levels: ['error'] }), // We also want to capture the `console.error` to, among other things, report the logs present in the `try/catch`
      new Sentry.BrowserTracing()
    ],
    tracesSampleRate: 1,
    // React log these warnings(bad Proptypes), in a console.error, it is not relevant to report this type of information to Sentry
    ignoreErrors: [/^Warning: /]
  })

  initBar({ client, container, lang, appName })

  return { container, client, lang, polyglot }
})

export default setupApp
