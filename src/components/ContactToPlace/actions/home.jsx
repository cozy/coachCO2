import React, { forwardRef } from 'react'
import { useContactToPlace } from 'src/components/Providers/ContactToPlaceProvider'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Radio from 'cozy-ui/transpiled/react/Radios'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

export const home = () => {
  const HomeComponent = forwardRef(({ onClick, ...props }, ref) => {
    const { t } = useI18n()
    const { label, setLabel } = useContactToPlace()

    const compLabel = t('contactToPlace.home')

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

  HomeComponent.displayName = 'HomeComponent'

  return {
    name: 'home',
    action: (_, { compLabel, setLabel }) => {
      setLabel(compLabel)
    },
    Component: HomeComponent
  }
}
