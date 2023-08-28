import { render, fireEvent } from '@testing-library/react'
import React from 'react'

import DropdownMenuButton from './DropdownMenuButton'

const setup = ({ type, selectedIndex, disabledIndexes, click } = {}) => {
  return render(
    <DropdownMenuButton
      type={type}
      options={['value1', 'value2']}
      selectedIndex={selectedIndex}
      disabledIndexes={disabledIndexes}
      onclick={click}
    />
  )
}

describe('DropdownMenuButton', () => {
  it('should trigger onclick fn from prop when clicking an option', () => {
    const click = jest.fn()
    const { getByTestId } = setup({ type: 'year', click })

    fireEvent.click(getByTestId('dropdown-menuItem-0'))
    expect(click).toHaveBeenCalledWith('year', 'value1')

    jest.clearAllMocks()

    fireEvent.click(getByTestId('dropdown-menuItem-1'))
    expect(click).toHaveBeenCalledWith('year', 'value2')
  })

  it('should show options value as menu option', () => {
    const { getByTestId } = setup()

    expect(getByTestId('dropdown-menuItem-0').textContent).toBe('value1')
    expect(getByTestId('dropdown-menuItem-1').textContent).toBe('value2')
  })

  it('should show first option value as default dropdown button value', () => {
    const { getByTestId } = setup()

    expect(getByTestId('dropdown-button').textContent).toBe('value1')
  })

  it('should disable the correct menu option', () => {
    const { getByTestId } = setup({ disabledIndexes: [1] })

    expect(getByTestId('dropdown-menuItem-0')).toHaveAttribute(
      'aria-disabled',
      'false'
    )
    expect(getByTestId('dropdown-menuItem-1')).toHaveAttribute(
      'aria-disabled',
      'true'
    )
  })

  it('should set the correct menu option selected', () => {
    const { getByTestId } = setup()

    expect(getByTestId('dropdown-menuItem-0')).toHaveClass('Mui-selected')
    expect(getByTestId('dropdown-menuItem-1')).not.toHaveClass('Mui-selected')

    fireEvent.click(getByTestId('dropdown-menuItem-1'))

    expect(getByTestId('dropdown-menuItem-0')).not.toHaveClass('Mui-selected')
    expect(getByTestId('dropdown-menuItem-1')).toHaveClass('Mui-selected')
  })
})
