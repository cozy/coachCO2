import cx from 'classnames'
import React, { useEffect, useState } from 'react'
import { modeToCategory } from 'src/components/helpers'
import { buildSettingsQuery } from 'src/queries/queries'

import { useClient, useQuery } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Checkbox from 'cozy-ui/transpiled/react/Checkbox'
import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

export const DialogDefaultMode = ({ item, onClose, onConfirm }) => {
  const [isChecked, setIsChecked] = useState(false)
  const [isSaveDisabled, setIsSaveDisabled] = useState(false)
  const [isBusy, setIsBusy] = useState(false)
  const { isDesktop } = useBreakpoints()
  const { t } = useI18n()
  const client = useClient()
  const settingsQuery = buildSettingsQuery()
  const { data: settings } = useQuery(
    settingsQuery.definition,
    settingsQuery.options
  )
  const defaultTransportModeByGroup = settings[0]?.defaultTransportModeByGroup
  const defaultCheck = defaultTransportModeByGroup?.[modeToCategory(item.id)]

  const handleChecked = () => {
    setIsChecked(prev => !prev)
  }

  // Set the default check when the dialog is opened
  useEffect(() => {
    setIsChecked(defaultCheck === item.id)
  }, [defaultTransportModeByGroup, defaultCheck, item.id])

  // Disable the save button if the default mode is the same as the current mode
  useEffect(() => {
    const sameCat = defaultCheck && defaultCheck === item.id
    setIsSaveDisabled(isChecked === !sameCat)
  }, [defaultCheck, isChecked, item.id])

  const handleConfirm = async () => {
    setIsBusy(true)
    await client.save({
      ...settings[0],
      defaultTransportModeByGroup: {
        ...defaultTransportModeByGroup,
        [modeToCategory(item.id)]: isChecked ? item.id : ''
      }
    })
    onConfirm()
  }

  return (
    <Dialog
      open
      title={item.title}
      size="large"
      disableGutters
      content={
        <List>
          <ListItem ellipsis={false} button onClick={handleChecked}>
            <ListItemIcon>
              <Checkbox checked={isChecked} />
            </ListItemIcon>
            <ListItemText
              primary={t('DialogDefaultMode.primary')}
              secondary={t('DialogDefaultMode.secondary')}
            />
          </ListItem>
        </List>
      }
      onClose={onClose}
      actions={
        <div
          className={cx('u-flex', {
            'u-w-100 u-ph-1': !isDesktop,
            'u-p-1': isDesktop
          })}
          style={{ gap: '1rem' }}
        >
          <Button
            label={t('DialogDefaultMode.actions.cancel')}
            variant="secondary"
            onClick={onClose}
          />
          <Button
            label={t('DialogDefaultMode.actions.save')}
            busy={isBusy}
            onClick={handleConfirm}
            disabled={!isSaveDisabled}
          />
        </div>
      }
    />
  )
}

export default DialogDefaultMode
