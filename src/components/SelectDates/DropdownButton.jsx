import React from 'react'
import cx from 'classnames'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'

import Typography from 'cozy-ui/transpiled/react/Typography'
import Icon from 'cozy-ui/transpiled/react/Icon'
import BottomIcon from 'cozy-ui/transpiled/react/Icons/Bottom'

const useStyles = makeStyles(() => ({
  button: {
    padding: '0 1rem',
    justifyContent: ({ spaceBetween }) =>
      spaceBetween ? 'space-between' : 'left'
  },
  typography: {
    textTransform: 'capitalize'
  }
}))

const DropdownButton = ({ children, className, spaceBetween, ...props }) => {
  const classes = useStyles({ spaceBetween })

  return (
    <Button
      className={cx(classes.button, className)}
      endIcon={<Icon icon={BottomIcon} size={10} />}
      {...props}
    >
      <Typography className={classes.typography}>{children}</Typography>
    </Button>
  )
}

export default DropdownButton
