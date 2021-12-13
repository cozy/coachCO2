import React, { useMemo } from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import InfoBlock from 'src/components/Trip/BottomSheet/InfoBlock'
import {
  getFormattedDuration,
  formatTripDistance,
  formatCalories,
  formatCO2
} from 'src/lib/trips'

const BottomSheetHeader = ({ trip }) => {
  const { t } = useI18n()

  const duration = useMemo(() => getFormattedDuration(trip), [trip])
  const distance = useMemo(() => formatTripDistance(trip), [trip])
  const calories = useMemo(() => formatCalories(trip), [trip])
  const CO2 = useMemo(() => formatCO2(trip), [trip])

  return (
    <>
      <InfoBlock title={t('trips.duration')} value={duration} />
      <InfoBlock title={t('trips.distance')} value={distance} />
      <InfoBlock title={t('trips.calories')} value={calories} />
      <InfoBlock title={t('trips.co2')} value={CO2} highlighted />
    </>
  )
}

export default React.memo(BottomSheetHeader)
