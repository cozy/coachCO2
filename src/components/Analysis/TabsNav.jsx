import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import Paper from 'cozy-ui/transpiled/react/Paper'
import { Tabs, Tab } from 'cozy-ui/transpiled/react/MuiTabs'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

const routes = ['/analysis/modes', '/analysis/purposes']

const a11yProps = index => ({
  id: `simple-tab-${index}`,
  'aria-controls': `simple-tabpanel-${index}`
})

const TabsNav = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { t } = useI18n()
  const currentTabIndex = routes.indexOf(
    routes.find(route => pathname.includes(route))
  )

  const handleChange = (_, value) => {
    navigate(routes[value])
  }

  return (
    <Paper>
      <Tabs value={currentTabIndex} onChange={handleChange}>
        <Tab label={t('nav.modes')} {...a11yProps(0)} />
        <Tab label={t('nav.purposes')} {...a11yProps(1)} />
      </Tabs>
    </Paper>
  )
}

export default TabsNav
