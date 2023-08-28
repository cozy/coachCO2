import { renderHook } from '@testing-library/react-hooks'
import React from 'react'
import AppLike from 'test/AppLike'

import { saveAccountToSettings } from './helpers'
import useAccountForProvider from './useAccountForProvider'

jest.mock('./helpers', () => ({
  saveAccountToSettings: jest.fn()
}))

const accountsData = [{ _id: 'accountId01' }, { _id: 'accountId02' }]
const settingsData = [{ account: { _id: 'accountId03' } }]
const accountFromSettingData = settingsData[0].account

const setup = ({ settings, accounts, selectedAccount } = {}) => {
  const wrapper = ({ children }) => <AppLike>{children}</AppLike>

  return renderHook(
    () => useAccountForProvider(settings, accounts, selectedAccount),
    {
      wrapper
    }
  )
}

describe('useAccountForProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return null if settings and accounts are loading', () => {
    const {
      result: { current: account }
    } = setup({
      settings: { data: null, isLoading: true },
      accounts: { data: null, isLoading: true },
      selectedAccount: null
    })

    expect(account).toStrictEqual(null)
  })

  it('should return null if only accounts is loading', () => {
    const {
      result: { current: account }
    } = setup({
      settings: { data: settingsData, isLoading: false },
      accounts: { data: null, isLoading: true },
      selectedAccount: null
    })

    expect(account).toStrictEqual(null)
  })

  it('should return null if only settings is loading', () => {
    const {
      result: { current: account }
    } = setup({
      settings: { data: null, isLoading: true },
      accounts: { data: null, isLoading: false },
      selectedAccount: null
    })

    expect(account).toStrictEqual(null)
  })

  describe('for the first render, aka selectedAccount is null', () => {
    it('should return the account from settings', () => {
      const {
        result: { current: account }
      } = setup({
        settings: { data: settingsData, isLoading: false },
        accounts: { data: null, isLoading: false },
        selectedAccount: null
      })

      expect(account).toStrictEqual(accountFromSettingData)
      expect(saveAccountToSettings).not.toHaveBeenCalled()
    })

    it('should return the account from settings even if there is accounts', () => {
      const {
        result: { current: account }
      } = setup({
        settings: { data: settingsData, isLoading: false },
        accounts: { data: accountsData, isLoading: false },
        selectedAccount: null
      })

      expect(account).toStrictEqual(accountFromSettingData)
      expect(saveAccountToSettings).not.toHaveBeenCalled()
    })

    it('should return the first account from accounts if no settings, and trigger saveAccountToSettings', () => {
      const {
        result: { current: account }
      } = setup({
        settings: { data: [], isLoading: false },
        accounts: { data: accountsData, isLoading: false },
        selectedAccount: null
      })

      expect(account).toStrictEqual(accountsData[0])
      expect(saveAccountToSettings).toHaveBeenCalled()
    })

    it('should return null if neither settings nor accounts are set', () => {
      const {
        result: { current: account }
      } = setup({
        settings: { data: [], isLoading: false },
        accounts: { data: [], isLoading: false },
        selectedAccount: null
      })

      expect(account).toStrictEqual(null)
      expect(saveAccountToSettings).not.toHaveBeenCalled()
    })
  })

  describe('for the other render, aka selectedAccount is not null', () => {
    it('should return selectedAccount', () => {
      const {
        result: { current: account }
      } = setup({
        settings: { data: settingsData, isLoading: false },
        accounts: { data: null, isLoading: false },
        selectedAccount: accountsData[0]
      })

      expect(account).toStrictEqual(accountsData[0])
      expect(saveAccountToSettings).not.toHaveBeenCalled()
    })

    it('should return the account from settings even if there is accounts', () => {
      const {
        result: { current: account }
      } = setup({
        settings: { data: settingsData, isLoading: false },
        accounts: { data: accountsData, isLoading: false },
        selectedAccount: accountsData[0]
      })

      expect(account).toStrictEqual(accountsData[0])
      expect(saveAccountToSettings).not.toHaveBeenCalled()
    })

    it('should return the first account from accounts if no settings, and trigger saveAccountToSettings', () => {
      const {
        result: { current: account }
      } = setup({
        settings: { data: [], isLoading: false },
        accounts: { data: accountsData, isLoading: false },
        selectedAccount: accountsData[0]
      })

      expect(account).toStrictEqual(accountsData[0])
      expect(saveAccountToSettings).not.toHaveBeenCalled()
    })

    it('should return null if neither settings nor accounts are set', () => {
      const {
        result: { current: account }
      } = setup({
        settings: { data: [], isLoading: false },
        accounts: { data: [], isLoading: false },
        selectedAccount: accountsData[0]
      })

      expect(account).toStrictEqual(accountsData[0])
      expect(saveAccountToSettings).not.toHaveBeenCalled()
    })
  })
})
