import React, { memo, useState } from 'react'
import ExportDialog from 'src/components/ExportCSV/ExportDialog'

import Buttons from 'cozy-ui/transpiled/react/Buttons'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

export const CsvExporter = ({ accountName }) => {
  const { t } = useI18n()
  const [isModalOpened, setIsModalOpened] = useState(false)

  return (
    <>
      <Buttons
        busy={false}
        variant="secondary"
        label={t('export.button')}
        onClick={() => setIsModalOpened(true)}
      />
      {isModalOpened && (
        <ExportDialog
          onClose={() => setIsModalOpened(false)}
          accountName={accountName}
        />
      )}
    </>
  )
}

/*
  The Settings component renders many times because of the useQuery hook and
  the use of the `uploadFileWithConflictStrategy` method of `cozy-client` (in the child component).
  To prevent these re-rendering, we memoize the first child
*/
export default memo(CsvExporter)
