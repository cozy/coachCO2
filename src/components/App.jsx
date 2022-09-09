import React from 'react'
import { HashRouter } from 'react-router-dom'

import { Layout, Main, Content } from 'cozy-ui/transpiled/react/Layout'
import Sprite from 'cozy-ui/transpiled/react/Icon/Sprite'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import AppRouter from 'src/components/AppRouter'
import Sidebar from 'src/components/Sidebar'

const App = () => {
  const { t } = useI18n()

  return (
    <HashRouter>
      <Layout>
        <Sidebar />
        <Main>
          <Content>
            <AppRouter />
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
export default React.memo(App)
