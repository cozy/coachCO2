import capitalize from 'lodash/capitalize'
import React, { useState } from 'react'
import ContactToPlaceDialogActions from 'src/components/ContactToPlace/ContactToPlaceDialogActions'
import ContactToPlaceDialogContent from 'src/components/ContactToPlace/ContactToPlaceDialogContent'
import { useContactToPlace } from 'src/components/Providers/ContactToPlaceProvider'

import ClickAwayListener from 'cozy-ui/transpiled/react/ClickAwayListener'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import HelpOutlined from 'cozy-ui/transpiled/react/Icons/HelpOutlined'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Tooltip from 'cozy-ui/transpiled/react/Tooltip'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const ContactToPlaceDialog = ({ isLoading }) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const { type, setType, setContact } = useContactToPlace()
  const { t } = useI18n()

  const handleClose = () => {
    setContact(null)
    setType()
  }

  return (
    <ConfirmDialog
      open
      title={
        <>
          {t(`contactToPlace.save${capitalize(type)}Place`)}
          <ClickAwayListener onClickAway={() => setShowTooltip(false)}>
            <Tooltip
              onClose={() => setShowTooltip(false)}
              open={showTooltip}
              disableFocusListener
              disableHoverListener
              disableTouchListener
              title={t('contactToPlace.tooltip')}
              placement="top-end"
              arrow
            >
              <ListItemIcon>
                <IconButton onClick={() => setShowTooltip(v => !v)}>
                  <Icon icon={HelpOutlined} />
                </IconButton>
              </ListItemIcon>
            </Tooltip>
          </ClickAwayListener>
        </>
      }
      content={
        isLoading ? (
          <Spinner
            size="xxlarge"
            className="u-flex u-flex-justify-center u-mt-1"
          />
        ) : (
          <ContactToPlaceDialogContent />
        )
      }
      actions={<ContactToPlaceDialogActions />}
      onClose={handleClose}
    />
  )
}

export default ContactToPlaceDialog
