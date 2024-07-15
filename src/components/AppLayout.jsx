import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from 'src/components/Sidebar'

import { BarComponent } from 'cozy-bar'
import CozyDevTools from 'cozy-client/dist/devtools'
import flag from 'cozy-flags'
import Sprite from 'cozy-ui/transpiled/react/Icon/Sprite'
import { Layout, Main, Content } from 'cozy-ui/transpiled/react/Layout'

const AppLayout = () => {
  return (
    <Layout>
      <BarComponent />
      {flag('debug') && <CozyDevTools />}
      <Sidebar />
      <Main>
        <Content>
          <Outlet />
        </Content>
      </Main>
      <Sprite />
    </Layout>
  )
}

export default AppLayout
