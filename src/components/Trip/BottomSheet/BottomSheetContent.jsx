import React, { useState } from 'react'
import PurposeEditDialog from 'src/components/EditDialogs/PurposeEditDialog'
import RecurrenceEditDialog from 'src/components/EditDialogs/RecurrenceEditDialog'
import { useTrip } from 'src/components/Providers/TripProvider'
import TimelineNode from 'src/components/Timeline/TimelineNode'
import TimelineSections from 'src/components/Timeline/TimelineSections'
import PurposeItem from 'src/components/Trip/BottomSheet/PurposeItem'
import { getTimeseriePurpose } from 'src/lib/timeseries'

import { BottomSheetItem } from 'cozy-ui/transpiled/react/BottomSheet'
import Divider from 'cozy-ui/transpiled/react/Divider'
import List from 'cozy-ui/transpiled/react/List'
import Timeline from 'cozy-ui/transpiled/react/Timeline'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import RecurringTripItem from './RecurringTripItem'

const styles = {
  divider: {
    margin: '-10px -32px 10px'
  }
}

const BottomSheetContent = () => {
  const { timeserie } = useTrip()
  const { isDesktop } = useBreakpoints()
  const [showPurposeDialog, setShowPurposeDialog] = useState(false)
  const [showRecurrenceDialog, setShowRecurrenceDialog] = useState(false)

  const purpose = getTimeseriePurpose(timeserie)
  const isRecurring = timeserie?.aggregation?.recurring

  const openPurposeDialog = () => setShowPurposeDialog(true)
  const closePurposeDialog = () => setShowPurposeDialog(false)
  const openRecurrenceDialog = () => setShowRecurrenceDialog(true)
  const closeRecurrenceDialog = () => setShowRecurrenceDialog(false)

  return (
    <>
      <BottomSheetItem disableGutters disableElevation>
        <Timeline className="u-pb-0 u-mb-0">
          <TimelineNode type="start" />
          <TimelineSections />
          <TimelineNode type="end" />
        </Timeline>
      </BottomSheetItem>
      {/* TODO: Remove the Divider when we have the real desktop view */}
      {isDesktop && <Divider style={styles.divider} />}
      <BottomSheetItem disableGutters disableElevation>
        <List className="u-pv-half">
          <PurposeItem purpose={purpose} onClick={openPurposeDialog} />
          {showPurposeDialog && (
            <PurposeEditDialog onClose={closePurposeDialog} />
          )}
          <Divider variant="inset" component="li" />
          <RecurringTripItem
            isRecurringTrip={isRecurring}
            purpose={purpose}
            onClick={openRecurrenceDialog}
          />
          {showRecurrenceDialog && (
            <RecurrenceEditDialog onClose={closeRecurrenceDialog} />
          )}
        </List>
      </BottomSheetItem>
    </>
  )
}

export default React.memo(BottomSheetContent)
