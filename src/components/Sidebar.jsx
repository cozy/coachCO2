import React from 'react'
import { NavLink as RouterLink } from 'react-router-dom'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import UISidebar from 'cozy-ui/transpiled/react/Sidebar'
import Nav, {
  NavItem,
  NavIcon,
  NavText,
  genNavLink
} from 'cozy-ui/transpiled/react/Nav'
import CategoriesIcon from 'cozy-ui/transpiled/react/Icons/Categories'
import SettingIcon from 'cozy-ui/transpiled/react/Icons/Setting'
import PieChartIcon from 'cozy-ui/transpiled/react/Icons/PieChart'

const NavLink = genNavLink(RouterLink)

const Sidebar = () => {
  const { t } = useI18n()

  return (
    <UISidebar>
      <Nav>
        <NavItem>
          <NavLink to="/trips">
            <NavIcon icon={CategoriesIcon} />
            <NavText>{t('nav.trips')}</NavText>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/analysis">
            <NavIcon icon={PieChartIcon} />
            <NavText>{t('nav.analysis')}</NavText>
          </NavLink>
        </NavItem>
        <NavItem secondary>
          <NavLink to="/analysis/modes">
            <NavText>{t('nav.modes')}</NavText>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/settings">
            <NavIcon icon={SettingIcon} />
            <NavText>{t('nav.settings')}</NavText>
          </NavLink>
        </NavItem>
      </Nav>
    </UISidebar>
  )
}

export default Sidebar
