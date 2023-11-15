import React, { useState } from 'react'
import EditModal from 'src/components/Goals/BikeGoal/Edit/EditModal'
import { getSource } from 'src/components/Goals/BikeGoal/helpers'
import useSettings from 'src/hooks/useSettings'

import Divider from 'cozy-ui/transpiled/react/Divider'
import Icon from 'cozy-ui/transpiled/react/Icon'
import CompanyIcon from 'cozy-ui/transpiled/react/Icons/Company'
import CompareIcon from 'cozy-ui/transpiled/react/Icons/Compare'
import PeopleIcon from 'cozy-ui/transpiled/react/Icons/People'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Switch from 'cozy-ui/transpiled/react/Switch'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const ModificationModalContent = () => {
  const { t } = useI18n()
  const [showEditModal, setShowEditModal] = useState('')
  const { isLoading, value: bikeGoal, save } = useSettings('bikeGoal')
  const { sourceName } = getSource()

  const handleSendToDACC = () => {
    save({ ...bikeGoal, sendToDACC: !bikeGoal.sendToDACC })
  }

  if (isLoading) {
    return (
      <Spinner size="xxlarge" className="u-flex u-flex-justify-center u-mt-1" />
    )
  }

  return (
    <>
      <List>
        <ListItem button onClick={() => setShowEditModal('lastname')}>
          <ListItemIcon>
            <Icon icon={PeopleIcon} />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="caption">
                {t('bikeGoal.edit.lastname')}
              </Typography>
            }
            secondary={
              <Typography variant="body1">{bikeGoal.lastname}</Typography>
            }
          />
        </ListItem>

        <Divider component="li" variant="inset" />

        <ListItem button onClick={() => setShowEditModal('firstname')}>
          <ListItemIcon />
          <ListItemText
            primary={
              <Typography variant="caption">
                {t('bikeGoal.edit.firstname')}
              </Typography>
            }
            secondary={
              <Typography variant="body1">{bikeGoal.firstname}</Typography>
            }
          />
        </ListItem>

        <Divider component="li" variant="inset" />

        <ListItem button onClick={() => setShowEditModal('daysToReach')}>
          <ListItemIcon>
            <Icon icon={CompanyIcon} />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="caption">
                {t('bikeGoal.edit.daysToReach')}
              </Typography>
            }
            secondary={
              <Typography variant="body1">{bikeGoal.daysToReach}</Typography>
            }
          />
        </ListItem>

        <Divider component="li" variant="inset" />

        <ListItem ellipsis={false} button onClick={handleSendToDACC}>
          <ListItemIcon>
            <Icon icon={CompareIcon} />
          </ListItemIcon>
          <ListItemText
            primary={
              sourceName
                ? t('bikeGoal.edit.compare_progress')
                : t('bikeGoal.edit.compare_progress_noValue')
            }
          />
          <ListItemSecondaryAction>
            <Switch
              className="u-w-auto"
              color="primary"
              checked={bikeGoal.sendToDACC}
              onChange={handleSendToDACC}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>

      {Boolean(showEditModal) && (
        <EditModal
          itemName={showEditModal}
          onClose={() => setShowEditModal('')}
        />
      )}
    </>
  )
}

export default ModificationModalContent
