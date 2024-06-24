import React from 'react'
import AccountProvider from 'src/components/Providers/AccountProvider'
import { GeolocationTrackingProvider } from 'src/components/Providers/GeolocationTrackingProvider'
import SelectDatesProvider from 'src/components/Providers/SelectDatesProvider'
import {
  CONTACTS_DOCTYPE,
  FILES_DOCTYPE,
  GEOJSON_DOCTYPE,
  ACCOUNTS_DOCTYPE,
  SETTINGS_DOCTYPE,
  CCO2_SETTINGS_DOCTYPE
} from 'src/doctypes'
import { launchComputeAggregateJob } from 'src/lib/computeAggregateService'

import { BarProvider } from 'cozy-bar'
import { CozyProvider, RealTimeQueries } from 'cozy-client'
import { WebviewIntentProvider } from 'cozy-intent'
import AlertProvider from 'cozy-ui/transpiled/react/providers/Alert'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import CozyTheme from 'cozy-ui/transpiled/react/providers/CozyTheme'
import { I18n } from 'cozy-ui/transpiled/react/providers/I18n'
import {
  StylesProvider,
  createGenerateClassName
} from 'cozy-ui/transpiled/react/styles'

/*
With MUI V4, it is possible to generate deterministic class names.
In the case of multiple react roots, it is necessary to disable this
feature. Since we have the cozy-bar root, we need to disable the
feature.
https://material-ui.com/styles/api/#stylesprovider
*/
const generateClassName = createGenerateClassName({
  disableGlobal: true
})

const AppProviders = ({ client, lang, polyglot, children }) => {
  React.useEffect(() => {
    const launch = async () => {
      launchComputeAggregateJob(client)
    }
    launch()
  }, [client])

  return (
    <WebviewIntentProvider>
      <StylesProvider generateClassName={generateClassName}>
        <CozyProvider client={client}>
          <RealTimeQueries doctype={GEOJSON_DOCTYPE} />
          <RealTimeQueries doctype={CCO2_SETTINGS_DOCTYPE} />
          <RealTimeQueries doctype={FILES_DOCTYPE} />
          <RealTimeQueries doctype={CONTACTS_DOCTYPE} />
          <RealTimeQueries doctype={ACCOUNTS_DOCTYPE} />
          <RealTimeQueries doctype={SETTINGS_DOCTYPE} />
          <BarProvider>
            <AccountProvider>
              <SelectDatesProvider>
                <I18n lang={lang} polyglot={polyglot}>
                  <CozyTheme>
                    <BreakpointsProvider>
                      <AlertProvider>
                        <GeolocationTrackingProvider>
                          {children}
                        </GeolocationTrackingProvider>
                      </AlertProvider>
                    </BreakpointsProvider>
                  </CozyTheme>
                </I18n>
              </SelectDatesProvider>
            </AccountProvider>
          </BarProvider>
        </CozyProvider>
      </StylesProvider>
    </WebviewIntentProvider>
  )
}

export default AppProviders
