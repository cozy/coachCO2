import React, { forwardRef } from 'react'
import { useContactToPlace } from 'src/components/Providers/ContactToPlaceProvider'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Radio from 'cozy-ui/transpiled/react/Radios'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

export const work = () => {
  const WorkActionComponent = forwardRef(({ onClick, ...props }, ref) => {
    const { t } = useI18n()
    const { label, setLabel } = useContactToPlace()

    const compLabel = t('contactToPlace.work')

    return (
      <ActionsMenuItem
        {...props}
        ref={ref}
        onClick={() => onClick({ compLabel, setLabel })}
      >
        <ListItemIcon>
          <Radio checked={label === compLabel} />
        </ListItemIcon>
        <ListItemText primary={compLabel} />
      </ActionsMenuItem>
    )
  })

  WorkActionComponent.displayName = 'WorkActionComponent'

  return {
    name: 'work',
    action: (_, { compLabel, setLabel }) => {
      setLabel(compLabel)
    },
    Component: WorkActionComponent
  }
}
