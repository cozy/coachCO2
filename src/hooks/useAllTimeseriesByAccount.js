import { useState, useEffect } from 'react'

import { useClient } from 'cozy-client'

import { useAccountContext } from 'src/components/Providers/AccountProvider'
import { fetchTimeseries } from './helpers'

const useAllTimeseriesByAccount = () => {
  const [timeseries, setTimeseries] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { account } = useAccountContext()
  const client = useClient()

  useEffect(() => {
    const fetchTimseriesAndSetStates = async () => {
      const timeseries = await fetchTimeseries(client, account)
      setTimeseries(timeseries)
      setIsLoading(false)
    }

    if (account) {
      fetchTimseriesAndSetStates()
    }
  }, [account, client])

  return { timeseries, isLoading }
}

export default useAllTimeseriesByAccount
