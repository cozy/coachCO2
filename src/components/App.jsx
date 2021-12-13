/* global cozy */
import React from 'react'
import { Route, Switch, Redirect, HashRouter } from 'react-router-dom'
import { hot } from 'react-hot-loader'
import cx from 'classnames'

import { useClient } from 'cozy-client'
import { Layout, Main, Content } from 'cozy-ui/transpiled/react/Layout'
import Sprite from 'cozy-ui/transpiled/react/Icon/Sprite'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import MuiCozyTheme from 'cozy-ui/transpiled/react/MuiCozyTheme'
import BarTitle from 'cozy-ui/transpiled/react/BarTitle'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import Sidebar from 'src/components/Sidebar'
import TripAccount from 'src/components/TripAccount'
import Settings from 'src/components/Settings'

const App = () => {
  const { t } = useI18n()
  const client = useClient()
  const { isMobile } = useBreakpoints()
  const { BarCenter } = cozy.bar

  return (
    <HashRouter>
      <Layout>
        {isMobile && (
          <BarCenter>
            <MuiCozyTheme>
              <BarTitle>{client.appMetadata.slug}</BarTitle>
            </MuiCozyTheme>
          </BarCenter>
        )}
        <Sidebar />
        <Main>
          <Content
            className={cx({
              'u-mh-half u-mv-1': isMobile,
              'u-mh-2 u-mv-1': !isMobile
            })}
          >
            <Switch>
              <Route path="/trips" component={TripAccount} />
              <Route path="/settings" component={Settings} />
              <Redirect from="/" to="/trips" />
              <Redirect from="*" to="/trips" />
            </Switch>
          </Content>
        </Main>
        <Alerter t={t} />
        <Sprite />
      </Layout>
    </HashRouter>
  )
}

/*
  Enable Hot Module Reload using `react-hot-loader` here
  We enable it here since App is the main root component
  No need to use it anywhere else, it sould work for all
  child components
*/
export default hot(module)(React.memo(App))
