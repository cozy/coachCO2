import React, { useState } from 'react'

import Timeline from '@material-ui/lab/Timeline'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'
import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import { BottomSheetItem } from 'cozy-ui/transpiled/react/BottomSheet'

import TimelineNode from 'src/components/Timeline/TimelineNode'
import TimelineSections from 'src/components/Timeline/TimelineSections'
import { formatDate } from 'src/lib/helpers'
import {
  getEndPlaceDisplayName,
  getStartPlaceDisplayName,
  getStartDate,
  getEndDate,
  getTimeseriePurpose
} from 'src/lib/timeseries'
import { useTrip } from 'src/components/Providers/TripProvider'
import PurposeItem from 'src/components/Trip/BottomSheet/PurposeItem'
import PurposeEditDialog from 'src/components/EditDialogs/PurposeEditDialog'
import RecurringTripItem from './RecurringTripItem'
import RecurrenceEditDialog from 'src/components/EditDialogs/RecurrenceEditDialog'

const styles = {
  divider: {
    margin: '-10px -32px 10px'
  }
}

const BottomSheetContent = () => {
  const { f, lang } = useI18n()
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
      <BottomSheetItem disableGutters>
        <Timeline className="u-pb-0 u-mb-0">
          <TimelineNode
            label={getStartPlaceDisplayName(timeserie)}
            endLabel={formatDate({ f, lang, date: getStartDate(timeserie) })}
            type="start"
          />
          <TimelineSections />
          <TimelineNode
            label={getEndPlaceDisplayName(timeserie)}
            endLabel={formatDate({ f, lang, date: getEndDate(timeserie) })}
            type="end"
          />
        </Timeline>
      </BottomSheetItem>
      {/* TODO: Remove the Divider when we have the real desktop view */}
      {isDesktop && <Divider style={styles.divider} />}
      <BottomSheetItem disableGutters>
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
