import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from 'src/components/Sidebar'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Sprite from 'cozy-ui/transpiled/react/Icon/Sprite'
import { Layout, Main, Content } from 'cozy-ui/transpiled/react/Layout'
import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'

const AppLayout = () => {
  const { t } = useI18n()

  return (
    <Layout>
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
