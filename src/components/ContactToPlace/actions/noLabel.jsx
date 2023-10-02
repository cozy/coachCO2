import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Radio from 'cozy-ui/transpiled/react/Radios'

export const noLabel = ({ label, setLabel }) => {
  const NoLabelActionComponent = forwardRef((props, ref) => {
    const { t } = useI18n()

    return (
      <ActionsMenuItem {...props} ref={ref}>
        <ListItemIcon>
          <Radio checked={label === undefined} />
        </ListItemIcon>
        <ListItemText primary={t('contactToPlace.noLabel')} />
      </ActionsMenuItem>
    )
  })

  NoLabelActionComponent.displayName = 'NoLabelActionComponent'

  return {
    name: 'noLabel',
    action: () => {
      setLabel(undefined)
    },
    disabled: false,
    Component: NoLabelActionComponent
  }
}
