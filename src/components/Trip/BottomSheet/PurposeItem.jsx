import React from 'react'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import ListItemAvatar from 'cozy-ui/transpiled/react/ListItemAvatar'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import { PurposeAvatar } from 'src/components/Avatar'
import { OTHER_PURPOSE } from 'src/constants'

const useStyles = makeStyles(() => ({
  root: {
    minWidth: '48px'
  }
}))

const PurposeItem = ({ purpose, onClick }) => {
  const { t } = useI18n()
  const styles = useStyles()

  return (
    <ListItem button onClick={onClick}>
      <ListItemAvatar classes={{ root: styles.root }}>
        <PurposeAvatar attribute={purpose} />
      </ListItemAvatar>
      <ListItemText
        primary={t('purpose')}
        primaryTypographyProps={{ variant: 'caption' }}
        secondary={t(`trips.purposes.${purpose}`)}
        secondaryTypographyProps={{ variant: 'body1', color: 'textPrimary' }}
      />
    </ListItem>
  )
}

PurposeItem.defaultProps = {
  purpose: OTHER_PURPOSE
}

export default React.memo(PurposeItem)
