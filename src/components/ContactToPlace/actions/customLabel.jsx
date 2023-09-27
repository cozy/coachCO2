import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Radio from 'cozy-ui/transpiled/react/Radios'

export const customLabel = ({ label, showCustomLabelModal }) => {
  const CustomLabelActionComponent = forwardRef((props, ref) => {
    const { t } = useI18n()
    const isCutomLabel = ![
      t('contactToPlace.work'),
      t('contactToPlace.home'),
      undefined
    ].includes(label)

    return (
      <ActionsMenuItem {...props} ref={ref}>
        <ListItemIcon>
          <Radio checked={isCutomLabel} />
        </ListItemIcon>
        <ListItemText primary={t('contactToPlace.custom')} />
      </ActionsMenuItem>
    )
  })

  CustomLabelActionComponent.displayName = 'CustomLabelActionComponent'

  return {
    name: 'customLabel',
    action: () => {
      showCustomLabelModal()
    },
    disabled: false,
    Component: CustomLabelActionComponent
  }
}
