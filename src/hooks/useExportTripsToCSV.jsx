import { useEffect, useState } from 'react'
import {
  getAccountLabel,
  useAccountContext
} from 'src/components/Providers/AccountProvider'
import { uploadFile } from 'src/lib/exportTripsToCSV'
import {
  buildTimeseriesQueryByAccountId,
  buildTimeseriesQuery
} from 'src/queries/queries'

import { isQueryLoading, useQueryAll, useClient } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const getQuery = ({ isAllAccountsSelected, accountId }) => {
  if (isAllAccountsSelected) {
    return buildTimeseriesQuery()
  }
  return buildTimeseriesQueryByAccountId({
    accountId
  })
}

const useExportTripsToCSV = () => {
  const { t } = useI18n()
  const client = useClient()
  const { account, isAllAccountsSelected } = useAccountContext()
  const [importCSVProcess, setImportCSVProcess] = useState(false)

  const [{ appDir, fileCreated, isLoading }, setResult] = useState({
    appDir: null,
    fileCreated: null,
    isLoading: true
  })

  const timeseriesQuery = getQuery({
    isAllAccountsSelected,
    accountId: account?._id
  })
  const { data: timeseries, ...queryResult } = useQueryAll(
    timeseriesQuery.definition,
    timeseriesQuery.options
  )
  const isTimeseriesQueryLoading =
    isQueryLoading(queryResult) || queryResult.hasMore

  const accountName = isAllAccountsSelected
    ? t('settings.allAccounts')
    : getAccountLabel(account)

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
