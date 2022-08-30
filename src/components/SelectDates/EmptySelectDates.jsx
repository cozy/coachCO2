import React from 'react'
import cx from 'classnames'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

import Box from 'cozy-ui/transpiled/react/Box'
import Paper from 'cozy-ui/transpiled/react/Paper'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Icon from 'cozy-ui/transpiled/react/Icon'
import RightIcon from 'cozy-ui/transpiled/react/Icons/Right'
import LeftIcon from 'cozy-ui/transpiled/react/Icons/Left'

const useStyles = makeStyles(theme => ({
  paper: {
    display: 'inline-flex',
    width: 264,
    borderRadius: 1000
  },
  iconButton: {
    color: theme.palette.text.icon,
    boxShadow: theme.shadows[2]
  }
}))

const EmptySelectDates = ({ className }) => {
  const classes = useStyles()

  return (
    <Box display="flex" className={className}>
      <Paper className={classes.paper} elevation={2} />
      <Box className="u-ml-half" display="inline-flex">
        <IconButton className={classes.iconButton} disabled size="medium">
          <Icon icon={LeftIcon} />
        </IconButton>
        <IconButton
          className={cx(classes.iconButton, 'u-ml-half')}
          disabled
          size="medium"
        >
          <Icon icon={RightIcon} />
        </IconButton>
      </Box>
    </Box>
  )
}

export default EmptySelectDates
