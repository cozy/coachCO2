import React, { useCallback, useState } from 'react'
import ModeEditDialog from 'src/components/EditDialogs/ModeEditDialog'
import { useTrip } from 'src/components/Providers/TripProvider'
import TimelineIcon from 'src/components/Timeline/TimelineIcon'
import { pickModeIcon } from 'src/components/helpers'
import {
  formatDistance,
  formatDuration,
  formatAvgSpeed,
  formatDate
} from 'src/lib/helpers'

import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const TimelineSections = () => {
  const { timeserie } = useTrip()
  const { t, f, lang } = useI18n()
  const [showModal, setShowModal] = useState(false)
  const [section, setSection] = useState(null)

  const handleClick = useCallback(
    section => () => {
      setSection(section)
      setShowModal(true)
    },
    []
  )
  const closeSectionDialog = useCallback(() => setShowModal(false), [])

  return (
    <>
      {timeserie.aggregation.sections.map((section, index) => (
        <TimelineIcon
          key={index}
          label={`${t(`trips.modes.${section.mode}`)} - ${formatDuration(
            section.duration
          )} - ${formatDistance(section.distance)} - ${formatAvgSpeed(
            section.avgSpeed
          )}`}
          endLabel={formatDate({ f, lang, date: new Date(section.endDate) })}
          icon={pickModeIcon(section.mode)}
          onClick={handleClick(section)}
        />
      ))}
      {showModal && (
        <ModeEditDialog section={section} onClose={closeSectionDialog} />
      )}
    </>
  )
}

export default React.memo(TimelineSections)
