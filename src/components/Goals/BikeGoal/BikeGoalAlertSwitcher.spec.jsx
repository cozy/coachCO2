import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import AppLike from 'test/AppLike'
import { SETTINGS_DOCTYPE } from 'src/doctypes'
import BikeGoalAlertSwitcher from 'src/components/Goals/BikeGoal/BikeGoalAlertSwitcher'

jest.mock('cozy-client', () => ({
  ...jest.requireActual('cozy-client'),
  useQuery: jest.fn(() => ({ data: {} }))
}))

describe('BikeGoalAlertSwitcher', () => {
  it('should call client.save when switch is clicked', () => {
    const mockSave = jest.fn()
    const { getByRole } = render(
      <AppLike client={{ save: mockSave }}>
        <BikeGoalAlertSwitcher />
      </AppLike>
    )
    const switchBtn = getByRole('checkbox')

    fireEvent.click(switchBtn)
    expect(mockSave).toBeCalledTimes(1)
    expect(mockSave).toBeCalledWith({
      _type: SETTINGS_DOCTYPE,
      bikeGoal: {
        showAlert: false
      }
    })

    fireEvent.click(switchBtn)
    expect(mockSave).toBeCalledTimes(2)
    expect(mockSave).toBeCalledWith({
      _type: SETTINGS_DOCTYPE,
      bikeGoal: {
        showAlert: true
      }
    })
  })
})
