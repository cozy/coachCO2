import { useEffect, useState } from 'react'
import {
  getAccountLabel,
  useAccountContext
} from 'src/components/Providers/AccountProvider'
import { uploadFile } from 'src/lib/exportTripsToCSV'
import { buildTimeseriesQueryByAccountIdAndDate } from 'src/queries/queries'

import { isQueryLoading, useQueryAll, useClient } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const useExportTripsToCSV = () => {
  const { t } = useI18n()
  const client = useClient()
  const { account } = useAccountContext()
  const [importCSVProcess, setImportCSVProcess] = useState(false)

  const [{ appDir, fileCreated, isLoading }, setResult] = useState({
    appDir: null,
    fileCreated: null,
    isLoading: true
  })

  const timeseriesQuery = buildTimeseriesQueryByAccountIdAndDate({
    accountId: account?._id,
    limitBy: 1000
  })
  const { data: timeseries, ...queryResult } = useQueryAll(
    timeseriesQuery.definition,
    timeseriesQuery.options
  )
  const isTimeseriesQueryLoading =
    isQueryLoading(queryResult) || queryResult.hasMore

  useEffect(() => {
    const init = async () => {
      setImportCSVProcess(true)
      const res = await uploadFile({
        client,
        t,
        timeseries,
        accountName: getAccountLabel(account)
      })

      setResult(res)
      setImportCSVProcess(false)
    }

    if (!isTimeseriesQueryLoading && !importCSVProcess && !appDir) {
      init()
    }
  }, [
    account,
    appDir,
    client,
    importCSVProcess,
    isTimeseriesQueryLoading,
    t,
    timeseries
  ])

  return { isLoading, appDir, file: fileCreated }
}

export default useExportTripsToCSV
