import cx from 'classnames'
import React, { useMemo } from 'react'

import TimelineConnector from 'cozy-ui/transpiled/react/TimelineConnector'
import TimelineContent from 'cozy-ui/transpiled/react/TimelineContent'
import TimelineDot from 'cozy-ui/transpiled/react/TimelineDot'
import TimelineItem from 'cozy-ui/transpiled/react/TimelineItem'
import TimelineSeparator from 'cozy-ui/transpiled/react/TimelineSeparator'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

const useStyles = makeStyles(theme => ({
  dotStart: {
    marginTop: '9px'
  },
  dot: {
    marginBottom: '-1px'
  },
  connector: {
    width: '6px',
    backgroundColor: theme.palette.primary.main
  },
  item: {
    marginTop: '-9px',
    paddingLeft: '11px',
    '&::before': {
      padding: 0,
      flexGrow: 0
    },
    cursor: ({ onClick }) => (onClick ? 'pointer' : undefined)
  },
  contentWrapper: {
    display: 'flex',
    marginLeft: '11px'
  },
  endLabel: {
    fontWeight: 700
  }
}))

const TimelineNode = ({ label, endLabel, type, onClick }) => {
  const classes = useStyles({ onClick })
  const isNotEndNode = useMemo(() => type !== 'end', [type])
  const isStartNode = useMemo(() => type === 'start', [type])

  return (
    <TimelineItem className={classes.item} onClick={onClick}>
      <TimelineSeparator>
        <TimelineDot
          className={cx({
            [classes.dot]: isNotEndNode,
            [classes.dotStart]: isStartNode
          })}
          color="primary"
          variant="outlined"
        />
        {isNotEndNode && <TimelineConnector className={classes.connector} />}
      </TimelineSeparator>
      <TimelineContent>
        <div className={classes.contentWrapper}>
          <Typography className="u-flex-grow-1">{label}</Typography>
          <Typography
            className={classes.endLabel}
            variant="body2"
            component="div"
          >
            {endLabel}
          </Typography>
        </div>
      </TimelineContent>
    </TimelineItem>
  )
}

export default React.memo(TimelineNode)
