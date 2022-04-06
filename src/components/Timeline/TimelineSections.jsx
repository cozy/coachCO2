import React, { useCallback, useMemo, useState } from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import TimelineIcon from 'src/components/Timeline/TimelineIcon'
import { formatDate, getSectionsFormatedFromTrip } from 'src/lib/trips.js'
import { pickModeIcon } from 'src/components/helpers'
import ModeEditDialog from 'src/components/EditDialogs/ModeEditDialog'
import { useTrip } from 'src/components/Providers/TripProvider'
import { getGeoJSONData } from 'src/lib/timeseries'

const TimelineSections = () => {
  const { timeserie } = useTrip()
  const { t, f, lang } = useI18n()
  const [showModal, setShowModal] = useState(false)
  const [section, setSection] = useState(null)
  const trip = getGeoJSONData(timeserie)

  const formatedSections = useMemo(
    () => getSectionsFormatedFromTrip(trip, lang),
    [lang, trip]
  )

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
      {formatedSections.map((section, index) => (
        <TimelineIcon
          key={index}
          label={`${t(`trips.modes.${section.mode}`)} - ${section.duration} - ${
            section.distance
          } - ${section.averageSpeed}`}
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
