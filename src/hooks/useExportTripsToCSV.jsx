import { useEffect, useState } from 'react'
import { useAccountContext } from 'src/components/Providers/AccountProvider'
import { uploadFile } from 'src/lib/exportTripsToCSV'
import {
  buildTimeseriesQueryByAccountLogin,
  buildTimeseriesQuery
} from 'src/queries/queries'

import { isQueryLoading, useQueryAll, useClient } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const getQuery = ({ isAllAccountsSelected, accountLogin }) => {
  if (isAllAccountsSelected) {
    return buildTimeseriesQuery()
  }
  return buildTimeseriesQueryByAccountLogin({
    accountLogin
  })
}

const useExportTripsToCSV = () => {
  const { t } = useI18n()
  const client = useClient()
  const { accountLogin, isAllAccountsSelected } = useAccountContext()
  const [importCSVProcess, setImportCSVProcess] = useState(false)

  const [{ appDir, fileCreated, isLoading }, setResult] = useState({
    appDir: null,
    fileCreated: null,
    isLoading: true
  })

  const timeseriesQuery = getQuery({
    isAllAccountsSelected,
    accountLogin
  })
  const { data: timeseries, ...queryResult } = useQueryAll(
    timeseriesQuery.definition,
    timeseriesQuery.options
  )
  const isTimeseriesQueryLoading =
    isQueryLoading(queryResult) || queryResult.hasMore

  const accountName = isAllAccountsSelected
    ? t('settings.allAccounts')
    : accountLogin

  useEffect(() => {
    const init = async () => {
      setImportCSVProcess(true)
      const res = await uploadFile({
        client,
        t,
        timeseries,
        accountName
      })

      setResult(res)
      setImportCSVProcess(false)
    }

    if (!isTimeseriesQueryLoading && !importCSVProcess && !appDir) {
      init()
    }
  }, [
    accountName,
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
