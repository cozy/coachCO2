import React from 'react'
import { NavLink as RouterLink } from 'react-router-dom'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import UISidebar from 'cozy-ui/transpiled/react/Sidebar'
import Nav, {
  NavItem,
  NavIcon,
  NavText,
  NavLink
} from 'cozy-ui/transpiled/react/Nav'
import CategoriesIcon from 'cozy-ui/transpiled/react/Icons/Categories'
import SettingIcon from 'cozy-ui/transpiled/react/Icons/Setting'

const Sidebar = () => {
  const { t } = useI18n()

  return (
    <UISidebar>
      <Nav>
        <NavItem>
          <RouterLink
            to="/trips"
            className={NavLink.className}
            activeClassName={NavLink.activeClassName}
          >
            <NavIcon icon={CategoriesIcon} />
            <NavText>{t('nav.trips')}</NavText>
          </RouterLink>
        </NavItem>
        <NavItem>
          <RouterLink
            to="/settings"
            className={NavLink.className}
            activeClassName={NavLink.activeClassName}
          >
            <NavIcon icon={SettingIcon} />
            <NavText>{t('nav.settings')}</NavText>
          </RouterLink>
        </NavItem>
      </Nav>
    </UISidebar>
  )
}

export default Sidebar
