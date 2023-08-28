import React, { memo, useState } from 'react'
import ExportDialog from 'src/components/ExportCSV/ExportDialog'

import Buttons from 'cozy-ui/transpiled/react/Buttons'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Label from 'cozy-ui/transpiled/react/Label'

export const CsvExporter = ({ accountName, ...props }) => {
  const { t } = useI18n()
  const [isModalOpened, setIsModalOpened] = useState(false)

  return (
    <>
      <div {...props}>
        <Label>{t('export.label')}</Label>
        <Buttons
          busy={false}
          variant="secondary"
          label={t('export.button')}
          onClick={() => setIsModalOpened(true)}
        />
      </div>
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
