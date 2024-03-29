import { render, fireEvent } from '@testing-library/react'
import React from 'react'
import BikeGoalAlertSwitcher from 'src/components/Goals/BikeGoal/BikeGoalAlertSwitcher'
import { CCO2_SETTINGS_DOCTYPE } from 'src/doctypes'
import AppLike from 'test/AppLike'

import { useQuery } from 'cozy-client'

jest.mock('cozy-client/dist/hooks/useQuery', () => jest.fn())

const setup = ({
  queryMock = {
    fetchStatus: 'loaded',
    data: []
  },
  mockSave = jest.fn()
} = {}) => {
  useQuery.mockReturnValue(queryMock)

  return render(
    <AppLike client={{ save: mockSave }}>
      <BikeGoalAlertSwitcher />
    </AppLike>
  )
}

describe('BikeGoalAlertSwitcher', () => {
  it('should call client.save when switch is clicked with no initial value', () => {
    const mockSave = jest.fn()
    const { getByRole } = setup({
      mockSave
    })

    const switchBtn = getByRole('checkbox')

    expect(switchBtn.checked).toBe(true)

    fireEvent.click(switchBtn)
    expect(mockSave).toBeCalled()
    expect(mockSave).toBeCalledWith({
      _type: CCO2_SETTINGS_DOCTYPE,
      bikeGoal: {
        showAlert: false
      }
    })
  })

  it('should call client.save when switch is clicked with a falsy initial value', () => {
    const queryMock = {
      fetchStatus: 'loaded',
      data: [
        {
          bikeGoal: { showAlert: false }
        }
      ]
    }
    const mockSave = jest.fn()
    const { getByRole } = setup({
      queryMock,
      mockSave
    })

    const switchBtn = getByRole('checkbox')

    expect(switchBtn.checked).toBe(false)

    fireEvent.click(switchBtn)
    expect(mockSave).toBeCalledTimes(1)
    expect(mockSave).toBeCalledWith({
      _type: CCO2_SETTINGS_DOCTYPE,
      bikeGoal: {
        showAlert: true
      }
    })
  })

  it('should call client.save when switch is clicked with a truthy initial value', () => {
    const queryMock = {
      fetchStatus: 'loaded',
      data: [
        {
          bikeGoal: { showAlert: true }
        }
      ]
    }
    const mockSave = jest.fn()
    const { getByRole } = setup({
      queryMock,
      mockSave
    })

    const switchBtn = getByRole('checkbox')

    expect(switchBtn.checked).toBe(true)

    fireEvent.click(switchBtn)
    expect(mockSave).toBeCalledTimes(1)
    expect(mockSave).toBeCalledWith({
      _type: CCO2_SETTINGS_DOCTYPE,
      bikeGoal: {
        showAlert: false
      }
    })
  })
})
