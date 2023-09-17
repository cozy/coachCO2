import PropTypes from 'prop-types'
import React from 'react'
import DaccPermissionsSVG from 'src/assets/icons/dacc-permissions.svg'
import AnonymousIcon from 'src/assets/icons/icon-anonymous.svg'
import ExportIcon from 'src/assets/icons/icon-export.svg'

import Button from 'cozy-ui/transpiled/react/Buttons'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Icon from 'cozy-ui/transpiled/react/Icon'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Paper from 'cozy-ui/transpiled/react/Paper'
import Typography from 'cozy-ui/transpiled/react/Typography'
import CozyTheme from 'cozy-ui/transpiled/react/providers/CozyTheme'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const DaccPermissionsDialog = ({
  sharedDataLabel,
  open,
  onClose,
  onRefuse,
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
            <Typography className="u-mt-1">
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
                          {sharedDataLabel}
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
              onClick={onRefuse}
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

DaccPermissionsDialog.propTypes = {
  sharedDataLabel: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onRefuse: PropTypes.func.isRequired,
  onAccept: PropTypes.func.isRequired,
  showDaccReasonsDialog: PropTypes.func.isRequired
}

export default DaccPermissionsDialog
