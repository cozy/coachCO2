import React, { useState } from 'react'
import PurposeEditDialog from 'src/components/EditDialogs/PurposeEditDialog'
import RecurrenceEditDialog from 'src/components/EditDialogs/RecurrenceEditDialog'
import { useContactToPlace } from 'src/components/Providers/ContactToPlaceProvider'
import { useTrip } from 'src/components/Providers/TripProvider'
import TimelineNode from 'src/components/Timeline/TimelineNode'
import TimelineSections from 'src/components/Timeline/TimelineSections'
import PurposeItem from 'src/components/Trip/BottomSheet/PurposeItem'
import { COMMUTE_PURPOSE } from 'src/constants'
import { formatDate } from 'src/lib/helpers'
import {
  getEndPlaceDisplayName,
  getStartPlaceDisplayName,
  getStartDate,
  getEndDate,
  getTimeseriePurpose
} from 'src/lib/timeseries'

import { BottomSheetItem } from 'cozy-ui/transpiled/react/BottomSheet'
import Divider from 'cozy-ui/transpiled/react/Divider'
import List from 'cozy-ui/transpiled/react/List'
import Timeline from 'cozy-ui/transpiled/react/Timeline'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import RecurringTripItem from './RecurringTripItem'

const styles = {
  divider: {
    margin: '-10px -32px 10px'
  }
}

const BottomSheetContent = () => {
  const { f, lang } = useI18n()
  const { timeserie } = useTrip()
  const { setType } = useContactToPlace()
  const { isDesktop } = useBreakpoints()
  const [showPurposeDialog, setShowPurposeDialog] = useState(false)
  const [showRecurrenceDialog, setShowRecurrenceDialog] = useState(false)

  const purpose = getTimeseriePurpose(timeserie)
  const isCommute = purpose === COMMUTE_PURPOSE
  const isRecurring = timeserie?.aggregation?.recurring

  const openPurposeDialog = () => setShowPurposeDialog(true)
  const closePurposeDialog = () => setShowPurposeDialog(false)
  const openRecurrenceDialog = () => setShowRecurrenceDialog(true)
  const closeRecurrenceDialog = () => setShowRecurrenceDialog(false)

  return (
    <>
      <BottomSheetItem disableGutters disableElevation>
        <Timeline className="u-pb-0 u-mb-0">
          <TimelineNode
            label={getStartPlaceDisplayName(timeserie)}
            endLabel={formatDate({ f, lang, date: getStartDate(timeserie) })}
            type="start"
            onClick={isCommute ? () => setType('start') : undefined}
          />
          <TimelineSections />
          <TimelineNode
            label={getEndPlaceDisplayName(timeserie)}
            endLabel={formatDate({ f, lang, date: getEndDate(timeserie) })}
            type="end"
            onClick={isCommute ? () => setType('end') : undefined}
          />
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
