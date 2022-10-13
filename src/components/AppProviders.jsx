import React from 'react'
import {
  StylesProvider,
  createGenerateClassName
} from 'cozy-ui/transpiled/react/styles'

import { CozyProvider, RealTimeQueries } from 'cozy-client'
import { WebviewIntentProvider } from 'cozy-intent'
import { I18n } from 'cozy-ui/transpiled/react/I18n'
import MuiCozyTheme from 'cozy-ui/transpiled/react/MuiCozyTheme'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import { GEOJSON_DOCTYPE } from 'src/doctypes'
import AccountProvider from 'src/components/Providers/AccountProvider'
import SelectDatesProvider from 'src/components/Providers/SelectDatesProvider'
import BikeGoalDateProvider from 'src/components/Providers/BikeGoalDateProvider'

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
          <AccountProvider>
            <SelectDatesProvider>
              <BikeGoalDateProvider>
                <I18n lang={lang} polyglot={polyglot}>
                  <MuiCozyTheme>
                    <BreakpointsProvider>{children}</BreakpointsProvider>
                  </MuiCozyTheme>
                </I18n>
              </BikeGoalDateProvider>
            </SelectDatesProvider>
          </AccountProvider>
        </CozyProvider>
      </StylesProvider>
    </WebviewIntentProvider>
  )
}

export default AppProviders
