import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Radio from 'cozy-ui/transpiled/react/Radios'

export const home = ({ label, setLabel }) => {
  const HomeComponent = forwardRef(({ onClick, ...props }, ref) => {
    const { t } = useI18n()
    const compLabel = t('contactToPlace.home')

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

  HomeComponent.displayName = 'HomeComponent'

  return {
    name: 'home',
    action: (_, { compLabel }) => {
      setLabel(compLabel)
    },
    disabled: false,
    Component: HomeComponent
  }
}
