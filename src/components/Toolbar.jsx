/* globals cozy */

import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'

import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PreviousIcon from 'cozy-ui/transpiled/react/Icons/Previous'
import BarTitle from 'cozy-ui/transpiled/react/BarTitle'
import CozyTheme from 'cozy-ui/transpiled/react/CozyTheme'

const { BarLeft, BarCenter } = cozy.bar

const styles = { backButton: { marginRight: '0.25rem' } }

// TODO: Should be in cozy-ui
const Toolbar = ({ title }) => {
  const history = useHistory()

  const historyBack = useCallback(() => history.goBack(), [history])

  return (
    <>
      <BarLeft>
        <IconButton style={styles.backButton} onClick={historyBack}>
          <Icon icon={PreviousIcon} size={16} />
        </IconButton>
      </BarLeft>
      <BarCenter>
        {/* Need to repeat the theme since the bar is in another react portal */}
        <CozyTheme variant="normal" className="u-ellipsis">
          <BarTitle noWrap>{title}</BarTitle>
        </CozyTheme>
      </BarCenter>
    </>
  )
}

export default React.memo(Toolbar)
