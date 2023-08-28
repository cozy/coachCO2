import React from 'react'

import Avatar from 'cozy-ui/transpiled/react/Avatar'
import TimelineConnector from 'cozy-ui/transpiled/react/TimelineConnector'
import TimelineContent from 'cozy-ui/transpiled/react/TimelineContent'
import TimelineDot from 'cozy-ui/transpiled/react/TimelineDot'
import TimelineItem from 'cozy-ui/transpiled/react/TimelineItem'
import TimelineSeparator from 'cozy-ui/transpiled/react/TimelineSeparator'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

const useStyles = makeStyles(theme => ({
  iconItem: {
    marginTop: '-14px',
    cursor: 'pointer',
    '&::before': {
      padding: 0,
      flexGrow: 0
    }
  },
  iconDot: {
    backgroundColor: theme.palette.background.paper,
    borderWidth: '1px',
    borderColor: theme.palette.border.main,
    margin: 0,
    padding: 0,
    boxShadow: 'none'
  },
  icon: {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.background.paper
  },
  connector: {
    width: '6px',
    backgroundColor: theme.palette.primary.main
  }
}))

const TimelineIcon = ({ icon, label, endLabel, onClick }) => {
  const classes = useStyles()

  return (
    <TimelineItem className={classes.iconItem} onClick={onClick}>
      <TimelineSeparator>
        <TimelineDot className={classes.iconDot}>
          <Avatar icon={icon} className={classes.icon} size={32} />
        </TimelineDot>
        <TimelineConnector className={classes.connector} />
      </TimelineSeparator>
      <TimelineContent className="u-flex">
        <Typography
          className="u-flex-grow-1"
          variant="body2"
          color="textSecondary"
        >
          {label}
        </Typography>
        <Typography
          className={classes.endLabel}
          variant="body2"
          component="div"
        >
          {endLabel}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  )
}

export default React.memo(TimelineIcon)
