import React, { forwardRef } from 'react'
import { isCustomLabel } from 'src/components/ContactToPlace/actions/helpers'
import { useContactToPlace } from 'src/components/Providers/ContactToPlaceProvider'
import { WORK_ADDRESS_CATEGORY } from 'src/constants'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Radio from 'cozy-ui/transpiled/react/Radios'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

export const work = () => {
  const WorkActionComponent = forwardRef(({ onClick, ...props }, ref) => {
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
              !isCustomLabel(label, t) && category === WORK_ADDRESS_CATEGORY
            }
          />
        </ListItemIcon>
        <ListItemText
          primary={`${t('contactToPlace.work')} (${t(
            'contactToPlace.pro'
          ).toLowerCase()})`}
        />
      </ActionsMenuItem>
    )
  })

  WorkActionComponent.displayName = 'WorkActionComponent'

  return {
    name: WORK_ADDRESS_CATEGORY,
    action: (_, { setLabel, setCategory }) => {
      setLabel()
      setCategory(WORK_ADDRESS_CATEGORY)
    },
    Component: WorkActionComponent
  }
}
