import React, { forwardRef } from 'react'
import { isCustomLabel } from 'src/components/ContactToPlace/actions/helpers'
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
    const { label, setLabel, category, setCategory } = useContactToPlace()

    return (
      <ActionsMenuItem
        {...props}
        ref={ref}
        onClick={() => onClick({ setLabel, setCategory })}
      >
        <ListItemIcon>
          <Radio
            checked={
              !isCustomLabel(label, t) && category === HOME_ADDRESS_CATEGORY
            }
          />
        </ListItemIcon>
        <ListItemText
          primary={`${t('contactToPlace.home')} (${t(
            'contactToPlace.perso'
          ).toLowerCase()})`}
        />
      </ActionsMenuItem>
    )
  })

  HomeComponent.displayName = 'HomeComponent'

  return {
    name: HOME_ADDRESS_CATEGORY,
    action: (_, { setLabel, setCategory }) => {
      setLabel()
      setCategory(HOME_ADDRESS_CATEGORY)
    },
    Component: HomeComponent
  }
}
