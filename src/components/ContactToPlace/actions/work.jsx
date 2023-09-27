import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Radio from 'cozy-ui/transpiled/react/Radios'

export const work = ({ label, setLabel }) => {
  const WorkActionComponent = forwardRef(({ onClick, ...props }, ref) => {
    const { t } = useI18n()
    const compLabel = t('contactToPlace.work')

    return (
      <ActionsMenuItem
        {...props}
        ref={ref}
        onClick={() => onClick({ compLabel })}
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
    action: (_, { compLabel }) => {
      setLabel(compLabel)
    },
    disabled: false,
    Component: WorkActionComponent
  }
}
