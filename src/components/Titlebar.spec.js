/* eslint-disable react/display-name */

import { render } from '@testing-library/react'
import React from 'react'
import Titlebar from 'src/components/Titlebar'

import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

jest.mock('cozy-bar', () => ({
  BarCenter: ({ children }) => <div data-testid="BarCenter">{children}</div>,
  BarLeft: ({ children }) => <div data-testid="BarLeft">{children}</div>
}))
jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(() => ({ pathname: '' }))
}))
jest.mock('cozy-ui/transpiled/react/providers/I18n', () => ({
  useI18n: jest.fn(() => ({ t: jest.fn() }))
}))
jest.mock('cozy-ui/transpiled/react/IconButton', () => ({ children }) => (
  <div data-testid="IconButton">{children}</div>
))
jest.mock('cozy-ui/transpiled/react/providers/Breakpoints', () =>
  jest.fn(() => ({ isMobile: false }))
)
jest.mock('cozy-ui/transpiled/react/Typography', () => ({ children }) => (
  <div data-testid="Typography">{children}</div>
))
jest.mock('cozy-ui/transpiled/react/BarTitle', () => ({ children }) => (
  <div data-testid="BarTitle">{children}</div>
))
jest.mock('cozy-ui/transpiled/react/IconButton', () => () => (
  <div data-testid="IconButton" />
))

describe('Titlebar', () => {
  // eslint-disable-next-line no-undef
  cozy = {
    bar: {
      BarCenter: jest.fn(({ children }) => (
        <div data-testid="BarCenter">{children}</div>
      )),
      BarLeft: jest.fn(({ children }) => (
        <div data-testid="BarLeft">{children}</div>
      ))
    }
  }

  it('should display Typography on Desktop view', () => {
    useBreakpoints.mockReturnValue({ isMobile: false })
    const { queryByTestId } = render(<Titlebar />)
    expect(queryByTestId('Typography')).toBeTruthy()
  })

  it('should not display Typography on Mobile view', () => {
    useBreakpoints.mockReturnValue({ isMobile: true })
    const { queryByTestId } = render(<Titlebar />)
    expect(queryByTestId('Typography')).not.toBeTruthy()
  })

  it('should display "title" property on Desktop view', () => {
    useBreakpoints.mockReturnValue({ isMobile: false })
    const { getByText } = render(<Titlebar label="My title Desktop view" />)
    expect(getByText('My title Desktop view')).toBeTruthy()
  })

  it('should display "title" property on Mobile view', () => {
    useBreakpoints.mockReturnValue({ isMobile: true })
    const { getByText } = render(<Titlebar label="My title Mobile view" />)
    expect(getByText('My title Mobile view')).toBeTruthy()
  })

  it('should not display "BarLeft" component on Desktop view when "onBack" property exist', () => {
    useBreakpoints.mockReturnValue({ isMobile: false })
    const backAction = jest.fn()
    const { queryByTestId } = render(<Titlebar onBack={backAction} />)
    expect(queryByTestId('BarLeft')).not.toBeTruthy()
  })

  it('should display "BarLeft" component on Mobile view when "onBack" property exist', () => {
    useBreakpoints.mockReturnValue({ isMobile: true })
    const backAction = jest.fn()
    const { queryByTestId } = render(<Titlebar onBack={backAction} />)
    expect(queryByTestId('BarLeft')).toBeTruthy()
  })

  it('should display "IconButton" component on Desktop view when "onBack" property exist', () => {
    useBreakpoints.mockReturnValue({ isMobile: false })
    const backAction = jest.fn()
    const { queryByTestId } = render(<Titlebar onBack={backAction} />)
    expect(queryByTestId('IconButton')).toBeTruthy()
  })

  it('should display "IconButton" component on Mobile view when "onBack" property exist', () => {
    useBreakpoints.mockReturnValue({ isMobile: true })
    const backAction = jest.fn()
    const { queryByTestId } = render(<Titlebar onBack={backAction} />)
    expect(queryByTestId('IconButton')).toBeTruthy()
  })
})
