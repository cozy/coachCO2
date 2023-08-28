import cx from 'classnames'
import React from 'react'

import Button from 'cozy-ui/transpiled/react/Button'
import Icon from 'cozy-ui/transpiled/react/Icon'
import BottomIcon from 'cozy-ui/transpiled/react/Icons/Bottom'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

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
