import React, { useRef, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import differenceInCalendarYears from 'date-fns/differenceInCalendarYears'
import subYears from 'date-fns/subYears'

import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import ActionMenu, { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'

import { getEarliestTimeserie } from 'src/lib/timeseries'
import { useBikeGoalDateContext } from 'src/components/Providers/BikeGoalDateProvider'
import ActionButton from 'src/components/Goals/BikeGoal/DateSelector/ActionButton'

const createStyles = ({ isMobile }) => ({
  actions: {
    right: isMobile ? '1rem' : '13rem'
  }
})

const BikeGoalDateSelector = ({ timeseries }) => {
  const { isMobile } = useBreakpoints()
  const { date, setDate } = useBikeGoalDateContext()
  const actionMenuAnchorRef = useRef()
  const [showMenu, setShowMenu] = useState(false)

  const styles = createStyles({ isMobile })
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
    <div
      ref={actionMenuAnchorRef}
      className="u-flex u-flex-justify-end u-pos-absolute u-top-m"
      style={styles.actions}
    >
      <ActionButton
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
    </div>
  )
}

BikeGoalDateSelector.propTypes = {
  timeseries: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default React.memo(BikeGoalDateSelector)
