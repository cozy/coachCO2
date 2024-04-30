import React, { forwardRef } from 'react'
import {
  isCustomLabel,
  makeCustomLabel
} from 'src/components/ContactToPlace/actions/helpers'
import { useContactToPlace } from 'src/components/Providers/ContactToPlaceProvider'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Radio from 'cozy-ui/transpiled/react/Radios'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

export const customLabel = ({ showCustomLabelModal }) => {
  const CustomLabelActionComponent = forwardRef((props, ref) => {
    const { t } = useI18n()
    const { label, category } = useContactToPlace()

    return (
      <ActionsMenuItem {...props} ref={ref}>
        <ListItemIcon>
          <Radio checked={isCustomLabel(label, t)} />
        </ListItemIcon>
        <ListItemText primary={makeCustomLabel({ label, category, t })} />
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
