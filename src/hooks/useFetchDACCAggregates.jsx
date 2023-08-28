import { useState, useEffect } from 'react'
import { fetchMonthlyAverageCO2FromDACCFor11Month } from 'src/lib/dacc'

import { useClient } from 'cozy-client'

const useFetchDACCAggregates = sendToDACC => {
  const client = useClient()
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchDataFromDACC = async () => {
      setIsLoading(true)
      const results = await fetchMonthlyAverageCO2FromDACCFor11Month(client)
      const averages = results?.length > 0 ? results.map(agg => agg.avg) : null
      setIsLoading(false)
      setData(averages)
    }
    if (sendToDACC) {
      fetchDataFromDACC()
    }
  }, [client, sendToDACC])

  return { isLoading, data }
}

export default useFetchDACCAggregates
