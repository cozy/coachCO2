import React, { useMemo } from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import InfoBlock from 'src/components/Trip/BottomSheet/InfoBlock'
import {
  getFormattedDuration,
  getFormattedTripDistance,
  computeAndformatCaloriesTrip,
  computeAndFormatCO2Trip
} from 'src/lib/trips'
import { getGeoJSONData } from 'src/lib/timeseries'
import { useTrip } from 'src/components/Providers/TripProvider'

const BottomSheetHeaderContent = () => {
  const { timeserie } = useTrip()
  const { t } = useI18n()
  const trip = getGeoJSONData(timeserie)

  const duration = useMemo(() => getFormattedDuration(trip), [trip])
  const distance = useMemo(() => getFormattedTripDistance(trip), [trip])
  const calories = useMemo(() => computeAndformatCaloriesTrip(trip), [trip])
  const CO2 = useMemo(() => computeAndFormatCO2Trip(trip), [trip])

  return (
    <>
      <InfoBlock title={t('trips.duration')} value={duration} />
      <InfoBlock title={t('trips.distance')} value={distance} />
      <InfoBlock title={t('trips.calories')} value={calories} />
      <InfoBlock title={t('trips.co2')} value={CO2} highlighted />
    </>
  )
}

export default React.memo(BottomSheetHeaderContent)