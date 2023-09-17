import React from 'react'
import { PurposeAvatar } from 'src/components/Avatar'
import { OTHER_PURPOSE } from 'src/constants'

import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const PurposeItem = ({ purpose, onClick }) => {
  const { t } = useI18n()

  return (
    <ListItem button onClick={onClick}>
      <ListItemIcon>
        <PurposeAvatar attribute={purpose} />
      </ListItemIcon>
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
