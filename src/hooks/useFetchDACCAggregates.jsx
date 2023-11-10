import { useState, useEffect } from 'react'
import {
  DACC_MEASURE_NAME_BIKE_GOAL,
  DACC_MEASURE_NAME_CO2_MONTHLY
} from 'src/constants'
import {
  fetchYesterdayBikeGoalFromDACC,
  getAvgDaysForGroupName
} from 'src/lib/daccBikeGoal'
import { fetchMonthlyAverageCO2FromDACCFor11Month } from 'src/lib/daccMonthlyCO2'

import { useClient } from 'cozy-client'

const fetchMeasureData = async (client, measureName) => {
  if (measureName === DACC_MEASURE_NAME_CO2_MONTHLY) {
    const results = await fetchMonthlyAverageCO2FromDACCFor11Month(client)
    const averages = results?.length > 0 ? results.map(agg => agg.avg) : null
    return averages
  }
  if (measureName === DACC_MEASURE_NAME_BIKE_GOAL) {
    const results = await fetchYesterdayBikeGoalFromDACC(client)
    if (!results) {
      return null
    }
    return getAvgDaysForGroupName(results)
  }
}

const useFetchDACCAggregates = ({ hasConsent, measureName }) => {
  const client = useClient()
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchDataFromDACC = async () => {
      setIsLoading(true)
      const results = await fetchMeasureData(client, measureName)
      setIsLoading(false)
      setData(results)
    }
    if (hasConsent) {
      fetchDataFromDACC()
    }
  }, [client, hasConsent, measureName])

  return { isLoading, data }
}

export default useFetchDACCAggregates
