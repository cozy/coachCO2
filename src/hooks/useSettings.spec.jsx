import { renderHook } from '@testing-library/react-hooks'
import React from 'react'
import { SETTINGS_DOCTYPE } from 'src/doctypes'
import AppLike from 'test/AppLike'

import { createMockClient, useQuery } from 'cozy-client'

import useSettings from './useSettings'

jest.mock('cozy-client/dist/hooks/useQuery', () => jest.fn())

const client = createMockClient({})

const setup = value => {
  const wrapper = ({ children }) => (
    <AppLike client={client}>{children}</AppLike>
  )

  return renderHook(() => useSettings(value), {
    wrapper
  })
}

describe('useSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('isLoading', () => {
    it('should return isLoading true when query is loading', () => {
      useQuery.mockReturnValue({
        fetchStatus: 'loading'
      })

      const {
        result: {
          current: { isLoading }
        }
      } = setup('foo')

      expect(isLoading).toBe(true)
    })

    it('should return isLoading false when query is loaded', () => {
      useQuery.mockReturnValue({
        fetchStatus: 'loaded',
        data: [{}]
      })

      const {
        result: {
          current: { isLoading }
        }
      } = setup('foo')

      expect(isLoading).toBe(false)
    })
  })

  describe('value', () => {
    it('should return undefined if data from query is an empty array', () => {
      useQuery.mockReturnValue({
        fetchStatus: 'loaded',
        data: []
      })

      const {
        result: {
          current: { value }
        }
      } = setup('foo')

      expect(value).toBe(undefined)
    })

    it('should return the value according to the key passed', () => {
      useQuery.mockReturnValue({
        fetchStatus: 'loaded',
        data: [{ foo: 'bar' }]
      })

      const {
        result: {
          current: { value }
        }
      } = setup('foo')

      expect(value).toBe('bar')
    })

    it('should return undefined if key is not present', () => {
      useQuery.mockReturnValue({
        fetchStatus: 'loaded',
        data: [{ notFoo: 'bar' }]
      })

      const {
        result: {
          current: { value }
        }
      } = setup('foo')

      expect(value).toBe(undefined)
    })
  })

  describe('save', () => {
    it('should use client.save with correct values', () => {
      useQuery.mockReturnValue({
        fetchStatus: 'loaded',
        data: [{ foo: 'bar' }]
      })

      const {
        result: {
          current: { save }
        }
      } = setup('foo')

      save('fooValue')

      expect(client.save).toHaveBeenCalledWith({
        _type: SETTINGS_DOCTYPE,
        foo: 'fooValue'
      })
    })
  })
})
