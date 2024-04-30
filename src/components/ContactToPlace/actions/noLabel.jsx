import React, { forwardRef } from 'react'
import { useContactToPlace } from 'src/components/Providers/ContactToPlaceProvider'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Radio from 'cozy-ui/transpiled/react/Radios'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

export const noLabel = () => {
  const NoLabelActionComponent = forwardRef(({ onClick, ...props }, ref) => {
    const { t } = useI18n()
    const { setLabel, category, setCategory } = useContactToPlace()

    return (
      <ActionsMenuItem
        {...props}
        ref={ref}
        onClick={() => onClick({ setLabel, setCategory })}
      >
        <ListItemIcon>
          <Radio checked={category === undefined} />
        </ListItemIcon>
        <ListItemText primary={t('contactToPlace.noLabel')} />
      </ActionsMenuItem>
    )
  })

  NoLabelActionComponent.displayName = 'NoLabelActionComponent'

  return {
    name: 'noLabel',
    action: (_, { setLabel, setCategory }) => {
      setLabel()
      setCategory()
    },
    Component: NoLabelActionComponent
  }
}
