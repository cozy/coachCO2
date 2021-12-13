import React, { useMemo } from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import TimelineIcon from 'src/components/Timeline/TimelineIcon'
import { getTime, getSectionsFormatedInfo } from 'src/lib/trips.js'
import { pickModeIcon } from 'src/components/helpers'

const TimelineSections = ({ trip }) => {
  const { t } = useI18n()
  const formatedSections = useMemo(() => getSectionsFormatedInfo(trip), [trip])

  return formatedSections.map((section, index) => (
    <TimelineIcon
      key={index}
      label={`${t(`trips.modes.${section.mode}`)} - ${section.duration} - ${
        section.distance
      } - ${section.averageSpeed}`}
      endLabel={getTime(new Date(section.endDate))}
      icon={pickModeIcon(section.mode)}
    />
  ))
}

export default React.memo(TimelineSections)
