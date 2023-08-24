import React from 'react'
import { Outlet } from 'react-router-dom'

import { Layout, Main, Content } from 'cozy-ui/transpiled/react/Layout'
import Sprite from 'cozy-ui/transpiled/react/Icon/Sprite'
import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import Sidebar from 'src/components/Sidebar'

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
