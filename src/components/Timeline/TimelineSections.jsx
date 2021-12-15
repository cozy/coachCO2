import React, { useMemo } from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import TimelineIcon from 'src/components/Timeline/TimelineIcon'
import { formatDate, getSectionsFormatedInfo } from 'src/lib/trips.js'
import { pickModeIcon } from 'src/components/helpers'

const TimelineSections = ({ trip }) => {
  const { t, f, lang } = useI18n()
  const formatedSections = useMemo(() => getSectionsFormatedInfo(trip, lang), [
    lang,
    trip
  ])

  return formatedSections.map((section, index) => (
    <TimelineIcon
      key={index}
      label={`${t(`trips.modes.${section.mode}`)} - ${section.duration} - ${
        section.distance
      } - ${section.averageSpeed}`}
      endLabel={formatDate({ f, lang, date: new Date(section.endDate) })}
      icon={pickModeIcon(section.mode)}
    />
  ))
}

export default React.memo(TimelineSections)
