import React, { forwardRef } from 'react'
import { useContactToPlace } from 'src/components/Providers/ContactToPlaceProvider'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Radio from 'cozy-ui/transpiled/react/Radios'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

export const customLabel = ({ showCustomLabelModal }) => {
  const CustomLabelActionComponent = forwardRef((props, ref) => {
    const { t } = useI18n()
    const { label } = useContactToPlace()

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
    Component: CustomLabelActionComponent
  }
}
