import React from 'react'
import { useClient } from 'cozy-client'

import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import BottomSheet, {
  BottomSheetItem
} from 'cozy-ui/transpiled/react/BottomSheet'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'

import { getTimeseriePurpose } from 'src/lib/timeseries'
import { useTrip } from 'src/components/Providers/TripProvider'
import {
  handleOccasionalTrip,
  handleRecurringTrip
} from 'src/components/EditDialogs/helpers'
import RecurrenceEditDialogTitle from 'src/components/EditDialogs/RecurrenceEditDialog/RecurrenceEditDialogTitle'
import RecurrenceEditDialogContent from 'src/components/EditDialogs/RecurrenceEditDialog/RecurrenceEditDialogContent'

const RecurrenceEditDialog = ({ onClose }) => {
  const { isMobile } = useBreakpoints()
  const { timeserie } = useTrip()
  const client = useClient()
  const purpose = getTimeseriePurpose(timeserie)
  const recurring = timeserie?.aggregation?.recurring ?? false
  const handleSelect = async recurring => {
    if (recurring) {
      await handleRecurringTrip({
        client,
        timeserie,
        purpose,
        oldPurpose: purpose
      })
    } else {
      await handleOccasionalTrip({ client, timeserie, purpose })
    }
    onClose()
  }

  if (isMobile) {
    return (
      <BottomSheet onClose={onClose} backdrop>
        <BottomSheetItem disableGutters>
          <RecurrenceEditDialogTitle />
          <Divider />
          <RecurrenceEditDialogContent
            recurring={recurring}
            setRecurring={handleSelect}
          />
        </BottomSheetItem>
      </BottomSheet>
    )
  }

  return (
    <ConfirmDialog
      open
      onClose={onClose}
      disableGutters
      title={<RecurrenceEditDialogTitle />}
      content={
        <RecurrenceEditDialogContent
          recurring={recurring}
          setRecurring={handleSelect}
        />
      }
    />
  )
}

export default RecurrenceEditDialog
