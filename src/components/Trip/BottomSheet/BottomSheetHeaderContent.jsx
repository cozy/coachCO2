import React from 'react'
import { useTrip } from 'src/components/Providers/TripProvider'
import InfoBlock from 'src/components/Trip/BottomSheet/InfoBlock'
import {
  getFormattedDuration,
  getFormattedDistance,
  getFormattedTotalCO2,
  getFormattedTotalCalories
} from 'src/lib/timeseries'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'

const BottomSheetHeaderContent = () => {
  const { timeserie } = useTrip()
  const { t } = useI18n()

  return (
    <>
      <InfoBlock
        title={t('trips.duration')}
        value={getFormattedDuration(timeserie)}
      />
      <InfoBlock
        title={t('trips.distance')}
        value={getFormattedDistance(timeserie)}
      />
      <InfoBlock
        title={t('trips.calories')}
        value={getFormattedTotalCalories(timeserie)}
      />
      <InfoBlock
        title={t('trips.co2')}
        value={getFormattedTotalCO2(timeserie)}
        highlighted
      />
    </>
  )
}

export default React.memo(BottomSheetHeaderContent)
