import React, { useRef, useState } from 'react'
import CustomLabelDialog from 'src/components/ContactToPlace/CustomLabelDialog'
import {
  noLabel,
  home,
  work,
  customLabel
} from 'src/components/ContactToPlace/actions'
import { useContactToPlace } from 'src/components/Providers/ContactToPlaceProvider'

import ActionsMenu from 'cozy-ui/transpiled/react/ActionsMenu'
import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import ActionsMenuMobileHeader from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuMobileHeader'
import Icon from 'cozy-ui/transpiled/react/Icon'
import BottomIcon from 'cozy-ui/transpiled/react/Icons/Bottom'
import LabelOutlinedIcon from 'cozy-ui/transpiled/react/Icons/LabelOutlined'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const LabelItem = () => {
  const [showCustomLabelModal, setShowCustomLabelModal] = useState(false)
  const [showLabelMenu, setShowLabelMenu] = useState(false)
  const anchorRef = useRef(null)
  const { t } = useI18n()
  const { label, setLabel } = useContactToPlace()

  const actions = makeActions([noLabel, home, work, customLabel], {
    label,
    showCustomLabelModal: () => setShowCustomLabelModal(true),
    setLabel
  })

  return (
    <>
      <ListItem
        ref={anchorRef}
        aria-controls="simple-menu"
        aria-haspopup="true"
        button
        gutters="disabled"
        onClick={() => setShowLabelMenu(true)}
      >
        <ListItemIcon>
          <Icon icon={LabelOutlinedIcon} />
        </ListItemIcon>
        <ListItemText primary={label || t('contactToPlace.noLabel')} />
        <ListItemIcon>
          <Icon icon={BottomIcon} />
        </ListItemIcon>
      </ListItem>
      <ActionsMenu
        ref={anchorRef}
        open={showLabelMenu}
        actions={actions}
        onClose={() => setShowLabelMenu(false)}
      >
        <ActionsMenuMobileHeader>
          <ListItemText
            primary={t('contactToPlace.label')}
            primaryTypographyProps={{ variant: 'h6', align: 'center' }}
          />
        </ActionsMenuMobileHeader>
      </ActionsMenu>
      {showCustomLabelModal && (
        <CustomLabelDialog onClose={() => setShowCustomLabelModal(false)} />
      )}
    </>
  )
}

export default LabelItem
