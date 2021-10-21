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

import BulletPoint from 'src/assets/icons/icon-bullet-point.svg'

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
            <NavIcon icon={BulletPoint} />
            <NavText>{t('nav.trips')}</NavText>
          </RouterLink>
        </NavItem>
        <NavItem>
          <RouterLink
            to="/settings"
            className={NavLink.className}
            activeClassName={NavLink.activeClassName}
          >
            <NavIcon icon={BulletPoint} />
            <NavText>{t('nav.settings')}</NavText>
          </RouterLink>
        </NavItem>
      </Nav>
    </UISidebar>
  )
}

export default Sidebar
