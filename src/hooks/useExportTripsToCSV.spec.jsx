import { renderHook } from '@testing-library/react-hooks'
import React from 'react'
import useExportTripsToCSV from 'src/hooks/useExportTripsToCSV'
import AppLike from 'test/AppLike'
import { mockSerie, mockTimeserie } from 'test/mockTrip'

import { createMockClient, useQuery, models } from 'cozy-client'
const {
  file: { uploadFileWithConflictStrategy }
} = models

jest.mock('src/lib/getOrCreateAppFolderWithReference', () => ({
  getOrCreateAppFolderWithReference: jest.fn(() => ({ _id: 'folderID' }))
}))

jest.mock('cozy-client/dist/hooks/useQuery', () => jest.fn())
jest.mock('cozy-client/dist/models/file')
jest.mock('src/components/Providers/AccountProvider', () => ({
  ...jest.requireActual('src/components/Providers/AccountProvider'),
  __esModule: true,
  useAccountContext: jest.fn().mockReturnValue({
    accountLogin: 'accountLogin'
  })
}))

const client = createMockClient({})

const setup = () => {
  const wrapper = ({ children }) => (
    <AppLike client={client}>{children}</AppLike>
  )

  return renderHook(() => useExportTripsToCSV(), {
    wrapper
  })
}

describe('useExportTripsToCSV', () => {
  it('should return isLoading true when timeseriesQuery is loading', () => {
    useQuery.mockReturnValue({
      fetchStatus: 'loading'
    })

    const {
      result: {
        current: { isLoading }
      }
    } = setup()

    expect(isLoading).toBe(true)
  })

  it('should return isLoading false when timeseriesQuery is loaded & CSV is builded & saved', async () => {
    useQuery.mockReturnValue({
      fetchStatus: 'loaded',
      data: [mockTimeserie('001', [mockSerie()])]
    })
    uploadFileWithConflictStrategy.mockReturnValue({
      data: { _id: 'CSVFileID' }
    })

    const { result, waitForNextUpdate } = setup()
    await waitForNextUpdate()

    expect(result.current.isLoading).toBe(false)
  })
})
