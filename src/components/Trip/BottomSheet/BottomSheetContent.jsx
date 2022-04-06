import React, { useMemo, useState, useCallback } from 'react'

import Timeline from '@material-ui/lab/Timeline'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import { BottomSheetItem } from 'cozy-ui/transpiled/react/BottomSheet'

import TimelineNode from 'src/components/Timeline/TimelineNode'
import TimelineSections from 'src/components/Timeline/TimelineSections'
import { getTripStartDate, getTripEndDate, formatDate } from 'src/lib/trips'
import {
  getEndPlaceDisplayName,
  getStartPlaceDisplayName
} from 'src/lib/timeseries'
import { useTrip } from 'src/components/Providers/TripProvider'
import PurposeItem from 'src/components/Trip/BottomSheet/PurposeItem'
import PurposeEditDialog from 'src/components/EditDialogs/PurposeEditDialog'

const styles = {
  divider: {
    margin: '-10px -32px 10px'
  }
}

const BottomSheetContent = () => {
  const { f, lang } = useI18n()
  const { trip, timeserie } = useTrip()
  const { isDesktop } = useBreakpoints()
  const [showPurposeDialog, setShowPurposeDialog] = useState(false)

  const startTime = useMemo(
    () => formatDate({ f, lang, date: getTripStartDate(trip) }),
    [f, lang, trip]
  )
  const endTime = useMemo(
    () => formatDate({ f, lang, date: getTripEndDate(trip) }),
    [f, lang, trip]
  )
  const purpose = useMemo(() => trip?.properties?.manual_purpose, [
    trip.properties.manual_purpose
  ])

  const openPurposeDialog = useCallback(() => setShowPurposeDialog(true), [])
  const closePurposeDialog = useCallback(() => setShowPurposeDialog(false), [])

  return (
    <>
      <BottomSheetItem disableGutters>
        <Timeline className="u-pb-0 u-mb-0">
          <TimelineNode
            label={getStartPlaceDisplayName(timeserie)}
            endLabel={startTime}
            type="start"
          />
          <TimelineSections />
          <TimelineNode
            label={getEndPlaceDisplayName(timeserie)}
            endLabel={endTime}
            type="end"
          />
        </Timeline>
      </BottomSheetItem>
      {/* TODO: Remove the Divider when we have the real desktop view */}
      {isDesktop && <Divider style={styles.divider} />}
      <BottomSheetItem disableGutters>
        <PurposeItem purpose={purpose} onClick={openPurposeDialog} />
      </BottomSheetItem>
      {showPurposeDialog && <PurposeEditDialog onClose={closePurposeDialog} />}
    </>
  )
}

export default React.memo(BottomSheetContent)
