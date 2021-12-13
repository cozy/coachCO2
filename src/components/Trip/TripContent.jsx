import React, { useMemo } from 'react'

import GeoCard from 'src/components/GeoCard'
import { computeCaloriesTrip, computeCO2Trip } from 'src/lib/metrics'

const TripContent = ({ trip }) => {
  const CO2 = useMemo(() => {
    const CO2Trip = computeCO2Trip(trip)
    return Math.round(CO2Trip * 100) / 100
  }, [trip])

  const calories = useMemo(() => {
    const caloriesTrip = computeCaloriesTrip(trip)
    return Math.round(caloriesTrip * 100) / 100
  }, [trip])

  return <GeoCard trip={trip} CO2={CO2} calories={calories} loading={false} />
}

export default React.memo(TripContent)
