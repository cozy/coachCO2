/* eslint-disable react/display-name */

import { render } from '@testing-library/react'
import React from 'react'
import PurposeAnalysis from 'src/components/Views/PurposeAnalysis'

import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

jest.mock('react-router-dom', () => ({
  useParams: jest.fn().mockReturnValue(() => ({ purpose: '', mode: '' })),
  useNavigate: jest.fn()
}))
jest.mock('cozy-ui/transpiled/react/I18n', () => ({
  useI18n: jest.fn(() => ({ t: jest.fn() }))
}))
jest.mock('cozy-ui/transpiled/react/hooks/useBreakpoints', () =>
  jest.fn(() => ({ isMobile: false }))
)
jest.mock('src/components/Titlebar', () => () => <div data-testid="Titlebar" />)
jest.mock('src/components/Analysis/Purposes/PurposesList', () => () => (
  <div data-testid="PurposesList" />
))
jest.mock('src/components/Analysis/TabsNav', () => () => (
  <div data-testid="TabsNav" />
))
jest.mock('src/components/SelectDatesWrapper', () => () => (
  <div data-testid="SelectDates" />
))

describe('PurposeAnalysis', () => {
  it('should not display TabsNav on Desktop view', () => {
    useBreakpoints.mockReturnValue({ isMobile: false })
    const { queryByTestId } = render(<PurposeAnalysis />)

    expect(queryByTestId('TabsNav')).not.toBeTruthy()
  })

  it('should display TabsNav on Mobile view', () => {
    useBreakpoints.mockReturnValue({ isMobile: true })
    const { queryByTestId } = render(<PurposeAnalysis />)

    expect(queryByTestId('TabsNav')).toBeTruthy()
  })
})
