import React from 'react'

import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Button from 'cozy-ui/transpiled/react/Buttons'
import CozyTheme from 'cozy-ui/transpiled/react/CozyTheme'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Paper from 'cozy-ui/transpiled/react/Paper'
import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'

import DaccPermissionsSVG from 'src/assets/icons/dacc-permissions.svg'
import AnonymousIcon from 'src/assets/icons/icon-anonymous.svg'
import ExportIcon from 'src/assets/icons/icon-export.svg'

const DaccPermissionsDialog = ({
  open,
  onClose,
  onAccept,
  showDaccReasonsDialog
}) => {
  const { t } = useI18n()

  return (
    <CozyTheme variant="inverted">
      <ConfirmDialog
        open={open}
        onClose={onClose}
        content={
          <div className="u-ta-center">
            <Icon icon={DaccPermissionsSVG} size={106} />
            <Typography variant="h4">
              {t('dacc.permissionsDialog.title')}
            </Typography>
            <Typography className="u-mt-1" variant="body1">
              {t('dacc.permissionsDialog.primaryText')}
            </Typography>
            <CozyTheme variant="normal">
              <Paper className="u-mt-1-half" elevation={0}>
                <List>
                  <ListItem divider>
                    <ListItemIcon>
                      <Icon icon={ExportIcon} size={24} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="h6">
                          {t('dacc.permissionsDialog.export_outside')}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <ListItem dense>
                    <ListItemIcon>
                      <Icon icon={AnonymousIcon} color="var(--iconTextColor)" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2">
                          {t('dacc.permissionsDialog.anonymized_emissions')}
                        </Typography>
                      }
                    />
                  </ListItem>
                </List>
              </Paper>
            </CozyTheme>
            <Typography
              className="u-mt-1-half"
              style={{ textDecoration: 'underline' }}
              variant="body1"
              onClick={showDaccReasonsDialog}
            >
              {t('dacc.permissionsDialog.why_asking')}
            </Typography>
            <Typography
              className="u-mt-1-half"
              variant="caption"
              color="textPrimary"
            >
              {t('dacc.permissionsDialog.secondaryText')}
            </Typography>
          </div>
        }
        actionsLayout="column"
        actions={
          <>
            <Button
              label={t('dacc.permissionsDialog.refuse')}
              onClick={onClose}
            />
            <Button
              label={t('dacc.permissionsDialog.accept')}
              onClick={onAccept}
            />
          </>
        }
      />
    </CozyTheme>
  )
}

export default DaccPermissionsDialog
