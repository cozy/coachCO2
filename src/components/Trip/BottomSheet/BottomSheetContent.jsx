import React, { useMemo } from 'react'

import Timeline from '@material-ui/lab/Timeline'

import Paper from 'cozy-ui/transpiled/react/Paper'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import TimelineNode from 'src/components/Timeline/TimelineNode'
import TimelineSections from 'src/components/Timeline/TimelineSections'
import {
  getStartPlaceDisplayName,
  getEndPlaceDisplayName,
  getStartDate,
  getEndDate,
  formatDate
} from 'src/lib/trips'
import { useTrip } from 'src/components/Trip/TripProvider'

const BottomSheetContent = () => {
  const { f, lang } = useI18n()
  const { trip } = useTrip()

  const startPlaceName = useMemo(() => getStartPlaceDisplayName(trip), [trip])
  const endPlaceName = useMemo(() => getEndPlaceDisplayName(trip), [trip])
  const startTime = useMemo(
    () => formatDate({ f, lang, date: getStartDate(trip) }),
    [f, lang, trip]
  )
  const endTime = useMemo(
    () => formatDate({ f, lang, date: getEndDate(trip) }),
    [f, lang, trip]
  )

  return (
    <Paper elevation={0} square>
      <Timeline>
        <TimelineNode
          label={startPlaceName}
          endLabel={startTime}
          type="start"
        />
        <TimelineSections />
        <TimelineNode label={endPlaceName} endLabel={endTime} type="end" />
      </Timeline>
    </Paper>
  )
}

export default React.memo(BottomSheetContent)
