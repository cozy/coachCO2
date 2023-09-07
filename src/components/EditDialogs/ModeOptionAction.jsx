import React from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import SettingIcon from 'cozy-ui/transpiled/react/Icons/Setting'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'

const ModeOptionAction = ({ item, onClick }) => {
  return (
    <ListItemSecondaryAction>
      <IconButton onClick={() => onClick({ item })}>
        <Icon icon={SettingIcon} />
      </IconButton>
    </ListItemSecondaryAction>
  )
}

export default ModeOptionAction
