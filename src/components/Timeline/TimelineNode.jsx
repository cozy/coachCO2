import cx from 'classnames'
import React, { useMemo } from 'react'
import { getPlaceLabelByContact } from 'src/components/ContactToPlace/helpers'
import { useContactToPlace } from 'src/components/Providers/ContactToPlaceProvider'
import { useTrip } from 'src/components/Providers/TripProvider'
import { COMMUTE_PURPOSE } from 'src/constants'
import { formatDate } from 'src/lib/helpers'
import {
  getTimeseriePurpose,
  getPlaceDisplayName,
  getPlaceDate
} from 'src/lib/timeseries'

import TimelineConnector from 'cozy-ui/transpiled/react/TimelineConnector'
import TimelineContent from 'cozy-ui/transpiled/react/TimelineContent'
import TimelineDot from 'cozy-ui/transpiled/react/TimelineDot'
import TimelineItem from 'cozy-ui/transpiled/react/TimelineItem'
import TimelineSeparator from 'cozy-ui/transpiled/react/TimelineSeparator'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
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
    cursor: ({ isCommute }) => (isCommute ? 'pointer' : undefined)
  },
  contentWrapper: {
    display: 'flex',
    marginLeft: '11px'
  },
  endLabel: {
    fontWeight: 700
  }
}))

const TimelineNode = ({ type }) => {
  const { t, f, lang } = useI18n()
  const { setType } = useContactToPlace()
  const { timeserie } = useTrip()

  const purpose = getTimeseriePurpose(timeserie)
  const isCommute = purpose === COMMUTE_PURPOSE

  const classes = useStyles({ isCommute })

  const isNotEndNode = useMemo(() => type !== 'end', [type])
  const isStartNode = useMemo(() => type === 'start', [type])
  const placeLabelByContact = getPlaceLabelByContact({ timeserie, type, t })

  const primary = placeLabelByContact
    ? placeLabelByContact
    : getPlaceDisplayName(timeserie, type)

  const secondary = placeLabelByContact
    ? getPlaceDisplayName(timeserie, type)
    : null

  return (
    <TimelineItem
      className={classes.item}
      onClick={isCommute ? () => setType(type) : undefined}
    >
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
          <div className="u-flex-grow-1">
            <Typography>{primary}</Typography>
            {secondary && (
              <Typography variant="caption">{secondary}</Typography>
            )}
          </div>
          <Typography
            className={classes.endLabel}
            variant="body2"
            component="div"
          >
            {formatDate({ f, lang, date: getPlaceDate(timeserie, type) })}
          </Typography>
        </div>
      </TimelineContent>
    </TimelineItem>
  )
}

export default React.memo(TimelineNode)
