import PropTypes from 'prop-types'
import React, { useRef, useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ActionButton from 'src/components/Goals/BikeGoal/DateSelector/ActionButton'
import { makeMenuDates } from 'src/components/Goals/BikeGoal/DateSelector/helpers'

import ActionMenu, {
  ActionMenuItem
} from 'cozy-ui/transpiled/react/deprecated/ActionMenu'

const BikeGoalDateSelector = ({ timeseries }) => {
  const { year } = useParams()
  const navigate = useNavigate()
  const actionMenuAnchorRef = useRef()
  const [showMenu, setShowMenu] = useState(false)

  const menuDates = useMemo(() => makeMenuDates(timeseries), [timeseries])

  return (
    <>
      <ActionButton
        ref={actionMenuAnchorRef}
        label={year}
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
            <ActionMenuItem
              key={index}
              onClick={() => navigate(`/bikegoal/${menuDate}/trips`)}
            >
              {menuDate}
            </ActionMenuItem>
          ))}
        </ActionMenu>
      )}
    </>
  )
}

BikeGoalDateSelector.propTypes = {
  timeseries: PropTypes.arrayOf(PropTypes.object)
}

export default React.memo(BikeGoalDateSelector)
