import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import { useQuery } from 'cozy-client'

import AppLike from 'test/AppLike'
import DaccManager from 'src/components/DaccManager/DaccManager'

jest.mock('cozy-client/dist/hooks/useQuery', () => jest.fn())

const setup = ({
  queryMock = {
    fetchStatus: 'loaded',
    data: [{ hideDaccAlerter: false, allowSendDataToDacc: undefined }]
  }
} = {}) => {
  useQuery.mockReturnValue(queryMock)

  return render(
    <AppLike>
      <DaccManager />
    </AppLike>
  )
}

describe('DaccManager', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return nothing if query is loading', () => {
    const { container } = setup({ queryMock: { fetchStatus: 'loading' } })

    expect(container).toMatchInlineSnapshot(`<div />`)
  })

  it('should show the banner', () => {
    const { queryByText } = setup()

    expect(
      queryByText(
        'Compare your emissions to the average of other users of the application?'
      )
    ).not.toBeNull()
  })

  describe('it should not show the banner', () => {
    it('when hideDaccAlerter is true', () => {
      const { queryByText } = setup({
        queryMock: {
          fetchStatus: 'loaded',
          data: [{ hideDaccAlerter: true, allowSendDataToDacc: undefined }]
        }
      })

      expect(
        queryByText(
          'Compare your emissions to the average of other users of the application?'
        )
      ).toBeNull()
    })

    it('when allowSendDataToDacc is true', () => {
      const { queryByText } = setup({
        queryMock: {
          fetchStatus: 'loaded',
          data: [{ hideDaccAlerter: false, allowSendDataToDacc: true }]
        }
      })

      expect(
        queryByText(
          'Compare your emissions to the average of other users of the application?'
        )
      ).toBeNull()
    })

    it('when hideDaccAlerter and allowSendDataToDacc are both true', () => {
      const { queryByText } = setup({
        queryMock: {
          fetchStatus: 'loaded',
          data: [{ hideDaccAlerter: true, allowSendDataToDacc: true }]
        }
      })

      expect(
        queryByText(
          'Compare your emissions to the average of other users of the application?'
        )
      ).toBeNull()
    })
  })

  describe('Modals', () => {
    it('no modal by default', () => {
      const { queryByText } = setup()

      expect(queryByText('Compare anonymously')).toBeNull()
      expect(queryByText('Request for permissions')).toBeNull()
      expect(queryByText('Reasons for permissions')).toBeNull()
    })

    it('should show comparison dialog', () => {
      const { getByRole, queryByText } = setup()

      fireEvent.click(getByRole('button', { name: 'Compare' }))

      expect(queryByText('Compare anonymously')).not.toBeNull()
    })

    it('should show permissions dialog', () => {
      const { getByRole, queryByText } = setup()

      fireEvent.click(getByRole('button', { name: 'Compare' }))
      fireEvent.click(getByRole('button', { name: 'I understood' }))

      expect(queryByText('Request for permissions')).not.toBeNull()
    })

    it('should show reasons dialog', () => {
      const { getByText, getByRole, queryByText } = setup()

      fireEvent.click(getByRole('button', { name: 'Compare' }))
      fireEvent.click(getByRole('button', { name: 'I understood' }))
      fireEvent.click(getByText('Why ask me for these permissions?'))

      expect(queryByText('Reasons for permissions')).not.toBeNull()
    })
  })
})
