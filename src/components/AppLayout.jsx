import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from 'src/components/Sidebar'

import { BarComponent } from 'cozy-bar'
import Sprite from 'cozy-ui/transpiled/react/Icon/Sprite'
import { Layout, Main, Content } from 'cozy-ui/transpiled/react/Layout'
import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const AppLayout = () => {
  const { t } = useI18n()

  return (
    <Layout>
      <BarComponent />
      <Sidebar />
      <Main>
        <Content>
          <Outlet />
        </Content>
      </Main>
      <Alerter t={t} />
      <Sprite />
    </Layout>
  )
}

export default AppLayout
