import React, { useMemo, useState } from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import TimelineIcon from 'src/components/Timeline/TimelineIcon'
import { formatDate, getSectionsFormatedInfo } from 'src/lib/trips.js'
import { pickModeIcon } from 'src/components/helpers'
import SectionEditModal from 'src/components/SectionEditModal'
import { useTrip } from 'src/components/Trip/TripProvider'

const TimelineSections = () => {
  const { trip } = useTrip()
  const { t, f, lang } = useI18n()
  const [showModal, setShowModal] = useState(false)
  const [section, setSection] = useState(null)

  const formatedSections = useMemo(() => getSectionsFormatedInfo(trip, lang), [
    lang,
    trip
  ])

  const handleClick = section => {
    setShowModal(true)
    setSection(section)
  }

  return (
    <>
      {formatedSections.map((section, index) => (
        <TimelineIcon
          key={index}
          label={`${t(`trips.modes.${section.mode}`)} - ${section.duration} - ${
            section.distance
          } - ${section.averageSpeed}`}
          endLabel={formatDate({ f, lang, date: new Date(section.endDate) })}
          icon={pickModeIcon(section.mode)}
          onClick={() => handleClick(section)}
        />
      ))}
      {showModal && (
        <SectionEditModal section={section} showModal={setShowModal} />
      )}
    </>
  )
}

export default React.memo(TimelineSections)
