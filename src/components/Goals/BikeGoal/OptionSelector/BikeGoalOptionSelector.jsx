import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import ActionMenu, { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'
import Icon from 'cozy-ui/transpiled/react/Icon'
import DotsIcon from 'cozy-ui/transpiled/react/Icons/Dots'
import InfoIcon from 'cozy-ui/transpiled/react/Icons/Info'
import ForbiddenIcon from 'cozy-ui/transpiled/react/Icons/Forbidden'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'
import RenameIcon from 'cozy-ui/transpiled/react/Icons/Rename'

import ActionButton from 'src/components/Goals/BikeGoal/OptionSelector/ActionButton'
import DeactivationModal from 'src/components/Goals/BikeGoal/OptionSelector/DeactivationModal'

const createStyles = ({ isMobile }) => ({
  divider: {
    borderTop: 0,
    marginLeft: isMobile ? '3rem' : undefined
  }
})

const BikeGoalOptionSelector = () => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const actionMenuAnchorRef = useRef()
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const [showDeactivateModal, setShowDeactivateModal] = useState(false)

  const styles = createStyles({ isMobile })

  return (
    <>
      <ActionButton
        ref={actionMenuAnchorRef}
        label={<Icon icon={DotsIcon} />}
        onClick={() => setShowMenu(v => !v)}
      />
      {showMenu && (
        <ActionMenu
          anchorElRef={actionMenuAnchorRef}
          autoclose={true}
          onClose={() => setShowMenu(false)}
          popperOptions={{ placement: 'bottom-end' }}
        >
          <ActionMenuItem
            left={<Icon icon={RenameIcon} />}
            onClick={() => navigate('edit')}
          >
            {t('bikeGoal.edit.modify')}
          </ActionMenuItem>
          <ActionMenuItem
            left={<Icon icon={InfoIcon} />}
            onClick={() => navigate('about')}
          >
            {t('bikeGoal.about.title')}
          </ActionMenuItem>
          <Divider style={styles.divider} />
          <ActionMenuItem
            left={<Icon icon={ForbiddenIcon} />}
            onClick={() => setShowDeactivateModal(true)}
          >
            {t('bikeGoal.deactivate.deactivate')}
          </ActionMenuItem>
        </ActionMenu>
      )}
      <DeactivationModal
        open={showDeactivateModal}
        onClose={() => setShowDeactivateModal(false)}
      />
    </>
  )
}

export default BikeGoalOptionSelector
