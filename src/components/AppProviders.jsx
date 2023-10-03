import React from 'react'
import AccountProvider from 'src/components/Providers/AccountProvider'
import SelectDatesProvider from 'src/components/Providers/SelectDatesProvider'
import { GEOJSON_DOCTYPE, SETTINGS_DOCTYPE } from 'src/doctypes'

import { CozyProvider, RealTimeQueries } from 'cozy-client'
import { WebviewIntentProvider } from 'cozy-intent'
import MuiCozyTheme from 'cozy-ui/transpiled/react/MuiCozyTheme'
import AlertProvider from 'cozy-ui/transpiled/react/providers/Alert'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/providers/Breakpoints'
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
  return (
    <WebviewIntentProvider>
      <StylesProvider generateClassName={generateClassName}>
        <CozyProvider client={client}>
          <RealTimeQueries doctype={GEOJSON_DOCTYPE} />
          <RealTimeQueries doctype={SETTINGS_DOCTYPE} />
          <AccountProvider>
            <SelectDatesProvider>
              <I18n lang={lang} polyglot={polyglot}>
                <MuiCozyTheme>
                  <BreakpointsProvider>
                    <AlertProvider>{children}</AlertProvider>
                  </BreakpointsProvider>
                </MuiCozyTheme>
              </I18n>
            </SelectDatesProvider>
          </AccountProvider>
        </CozyProvider>
      </StylesProvider>
    </WebviewIntentProvider>
  )
}

export default AppProviders
