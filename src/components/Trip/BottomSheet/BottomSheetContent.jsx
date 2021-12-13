import React, { useMemo } from 'react'

import Timeline from '@material-ui/lab/Timeline'

import Paper from 'cozy-ui/transpiled/react/Paper'

import TimelineNode from 'src/components/Timeline/TimelineNode'
import TimelineSections from 'src/components/Timeline/TimelineSections'
import {
  getStartPlaceDisplayName,
  getEndPlaceDisplayName,
  getStartDate,
  getEndDate,
  getTime
} from 'src/lib/trips.js'

const BottomSheetContent = ({ trip }) => {
  const startPlaceName = useMemo(() => getStartPlaceDisplayName(trip), [trip])
  const endPlaceName = useMemo(() => getEndPlaceDisplayName(trip), [trip])
  const startTime = useMemo(() => getTime(getStartDate(trip)), [trip])
  const endTime = useMemo(() => getTime(getEndDate(trip)), [trip])

  return (
    <Paper elevation={0} square>
      <Timeline>
        <TimelineNode
          label={startPlaceName}
          endLabel={startTime}
          type="start"
        />
        <TimelineSections trip={trip} />
        <TimelineNode label={endPlaceName} endLabel={endTime} type="end" />
      </Timeline>
    </Paper>
  )
}

export default React.memo(BottomSheetContent)
