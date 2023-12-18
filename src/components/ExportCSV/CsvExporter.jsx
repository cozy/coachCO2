import React, { memo, useState } from 'react'
import ExportDialog from 'src/components/ExportCSV/ExportDialog'

import Icon from 'cozy-ui/transpiled/react/Icon'
import ReplyIcon from 'cozy-ui/transpiled/react/Icons/Reply'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

export const CsvExporter = ({ accountName }) => {
  const { t } = useI18n()
  const [isModalOpened, setIsModalOpened] = useState(false)

  return (
    <>
      <ListItem
        button
        gutters="disabled"
        ellipsis={false}
        disabled={isModalOpened}
        onClick={() => setIsModalOpened(true)}
      >
        <ListItemIcon>
          <Icon icon={ReplyIcon} />
        </ListItemIcon>
        <ListItemText primary={t('export.button')} />
      </ListItem>
      {isModalOpened && (
        <ExportDialog
          accountName={accountName}
          onClose={() => {
            setIsModalOpened(false)
          }}
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
