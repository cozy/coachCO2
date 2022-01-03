import React from 'react'

import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'

import ModeItem from 'src/components/SectionEditDialog/ModeItem'
import { modes } from 'src/components/helpers'

const ModeList = ({ section, closeModal }) => {
  return (
    <List>
      {modes.map((mode, index) => (
        <ModeItem
          key={index}
          section={section}
          closeModal={closeModal}
          mode={mode}
        />
      ))}
    </List>
  )
}

export default React.memo(ModeList)
