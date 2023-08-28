import { render, fireEvent } from '@testing-library/react'
import React from 'react'
import AppLike from 'test/AppLike'

import SelectDates from './SelectDates'

const dates = [new Date('2022-01'), new Date('2021-12'), new Date('2021-11')]
const defaultDate = dates[1]

const setup = ({
  options = dates,
  selectedDate = defaultDate,
  setSelectedDate = jest.fn(x => x)
} = {}) => {
  return {
    comp: render(
      <AppLike>
        <SelectDates
          options={options}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </AppLike>
    ),
    setSelectedDate
  }
}

describe('SelectDates', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should disabled next button if latest date is selected', async () => {
    const { comp } = setup({ selectedDate: dates[0] })
    const { getByTestId } = comp

    expect(getByTestId('next-button')).toHaveAttribute('disabled')
  })

  it('should disabled previous button if earliest date is selected', async () => {
    const { comp } = setup({ selectedDate: dates[2] })
    const { getByTestId } = comp

    expect(getByTestId('previous-button')).toHaveAttribute('disabled')
  })

  it('should set the new date correctly when clicking previous month button', async () => {
    const setSelectedDate = jest.fn(x => {
      const createdNewDate = x(new Date(defaultDate))
      const expectedNewDate = dates[2]

      if (createdNewDate.getTime() !== expectedNewDate.getTime()) {
        throw new Error("setSelectedDate function doesn't work properly")
      }
    })

    const { comp, setSelectedDate: mockSetSelectedDate } = setup({
      setSelectedDate
    })

    const { getByTestId } = comp

    fireEvent.click(getByTestId('previous-button'))
    expect(mockSetSelectedDate).toHaveBeenCalled()
  })

  it('should set the new date correctly when clicking next month button', async () => {
    const setSelectedDate = jest.fn(x => {
      const createdNewDate = x(new Date(defaultDate))
      const expectedNewDate = dates[0]

      if (createdNewDate.getTime() !== expectedNewDate.getTime()) {
        throw new Error("setSelectedDate function doesn't work properly")
      }
    })

    const { comp, setSelectedDate: mockSetSelectedDate } = setup({
      setSelectedDate
    })

    const { getByTestId } = comp

    fireEvent.click(getByTestId('next-button'))
    expect(mockSetSelectedDate).toHaveBeenCalled()
  })
})
