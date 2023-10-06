import React, { forwardRef } from 'react'
import { useContactToPlace } from 'src/components/Providers/ContactToPlaceProvider'
import { HOME_ADDRESS_CATEGORY } from 'src/constants'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Radio from 'cozy-ui/transpiled/react/Radios'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

export const home = () => {
  const HomeComponent = forwardRef(({ onClick, ...props }, ref) => {
    const { t } = useI18n()
    const { label, setLabel, setCategory } = useContactToPlace()

    const compLabel = t('contactToPlace.home')

    return (
      <ActionsMenuItem
        {...props}
        ref={ref}
        onClick={() => onClick({ compLabel, setLabel, setCategory })}
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
    name: HOME_ADDRESS_CATEGORY,
    action: (_, { compLabel, setLabel, setCategory }) => {
      setLabel(compLabel)
      setCategory(HOME_ADDRESS_CATEGORY)
    },
    Component: HomeComponent
  }
}
