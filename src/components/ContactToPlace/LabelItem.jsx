import React, { useRef, useState } from 'react'
import CustomLabelDialog from 'src/components/ContactToPlace/CustomLabelDialog'
import {
  noLabel,
  home,
  work,
  customLabel
} from 'src/components/ContactToPlace/actions'

import ActionsMenu from 'cozy-ui/transpiled/react/ActionsMenu'
import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import ActionsMenuMobileHeader from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuMobileHeader'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import BottomIcon from 'cozy-ui/transpiled/react/Icons/Bottom'
import PeopleIcon from 'cozy-ui/transpiled/react/Icons/People'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

const LabelItem = ({ label, setLabel }) => {
  const { t } = useI18n()
  const anchorRef = useRef(null)
  const [showCustomLabelModal, setShowCustomLabelModal] = useState(false)
  const [showLabelMenu, setShowLabelMenu] = useState(false)

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
          <Icon icon={PeopleIcon} />
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
        <CustomLabelDialog
          setLabel={setLabel}
          onClose={() => setShowCustomLabelModal(false)}
        />
      )}
    </>
  )
}

export default LabelItem