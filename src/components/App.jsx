import React from 'react'
import { Route, Switch, Redirect, HashRouter } from 'react-router-dom'
import { hot } from 'react-hot-loader'

import { Layout, Main, Content } from 'cozy-ui/transpiled/react/Layout'
import Sprite from 'cozy-ui/transpiled/react/Icon/Sprite'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import Sidebar from 'src/components/Sidebar'
import Trips from 'src/components/Views/Trips'
import Trip from 'src/components/Views/Trip'
import ModeAnalysis from 'src/components/Views/ModeAnalysis'
import Settings from 'src/components/Views/Settings'

const App = () => {
  const { t } = useI18n()

  return (
    <HashRouter>
      <Layout>
        <Sidebar />
        <Main>
          <Content>
            <Switch>
              <Route path="/trip/:geojsonId" component={Trip} />
              <Route path="/trips" component={Trips} />
              <Route path="/settings" component={Settings} />
              <Route path="/analysis/modes" component={ModeAnalysis} />
              <Redirect from="/analysis" to="/analysis/modes" />
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
