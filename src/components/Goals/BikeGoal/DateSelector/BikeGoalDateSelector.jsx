import React, { useRef, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import differenceInCalendarYears from 'date-fns/differenceInCalendarYears'
import subYears from 'date-fns/subYears'

import ActionMenu, { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'

import { getEarliestTimeserie } from 'src/lib/timeseries'
import { useBikeGoalDateContext } from 'src/components/Providers/BikeGoalDateProvider'
import ActionButton from 'src/components/Goals/BikeGoal/DateSelector/ActionButton'

const BikeGoalDateSelector = ({ timeseries }) => {
  const { date, setDate } = useBikeGoalDateContext()
  const actionMenuAnchorRef = useRef()
  const [showMenu, setShowMenu] = useState(false)

  const earliestDate = useMemo(
    () => new Date(getEarliestTimeserie(timeseries).startDate),
    [timeseries]
  )
  const latestDate = useMemo(() => new Date(), [])
  const numberOfYears = differenceInCalendarYears(latestDate, earliestDate)
  const menuDates = useMemo(
    () =>
      Array.from({ length: numberOfYears + 1 }, (_, index) => {
        return subYears(latestDate, index)
      }),
    [latestDate, numberOfYears]
  )

  return (
    <>
      <ActionButton
        ref={actionMenuAnchorRef}
        label={date.getFullYear()}
        onClick={() => setShowMenu(v => !v)}
      />
      {showMenu && (
        <ActionMenu
          anchorElRef={actionMenuAnchorRef}
          autoclose={true}
          onClose={() => setShowMenu(false)}
          popperOptions={{ placement: 'bottom-end' }}
        >
          {menuDates.map((menuDate, index) => (
            <ActionMenuItem key={index} onClick={() => setDate(menuDate)}>
              {menuDate.getFullYear()}
            </ActionMenuItem>
          ))}
        </ActionMenu>
      )}
    </>
  )
}

BikeGoalDateSelector.propTypes = {
  timeseries: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default React.memo(BikeGoalDateSelector)
