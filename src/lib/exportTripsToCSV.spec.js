import { uploadFile } from 'src/lib/exportTripsToCSV'
import { getOrCreateAppFolderWithReference } from 'src/lib/getOrCreateAppFolderWithReference'
import { mockTimeserie, mockSerie } from 'test/mockTrip'

import { models } from 'cozy-client'

const {
  file: { uploadFileWithConflictStrategy }
} = models

jest.mock('cozy-client/dist/models/file')
jest.mock('src/lib/getOrCreateAppFolderWithReference', () => ({
  getOrCreateAppFolderWithReference: jest.fn()
}))
jest.mock('cozy-client', () => ({
  ...jest.requireActual('cozy-client'),
  query: jest.fn(),
  models: {
    file: {
      uploadFileWithConflictStrategy: jest.fn(() => ({
        data: { _id: 'fileId00', name: 'fileName00' }
      }))
    },
    geo: { geodesicDistance: jest.fn() }
  }
}))

describe('uploadFile', () => {
  const t = jest.fn()
  const mockClient = (mockData = []) => {
    const client = {
      fetchQueryAndGetFromState: jest.fn(() => ({
        data: [mockData]
      }))
    }
    return client
  }
  getOrCreateAppFolderWithReference.mockReturnValue({
    _id: 'folderId00',
    path: '/Path/To/Folder'
  })

  uploadFileWithConflictStrategy.mockReturnValue({
    data: {
      _id: 'fileId00',
      name: 'fileName00'
    }
  })

  it('should return correctly formatted trips for the CSV file', async () => {
    const mockData = mockTimeserie('timeserieId01', [mockSerie()])
    const client = mockClient(mockData)
    const timeseries = [mockTimeserie('001', [mockSerie()])]
    let tripCSV = await uploadFile({
      client,
      t,
      timeseries,
      accountName: 'test'
    })

    expect(tripCSV).toMatchObject({
      appDir: {
        _id: 'folderId00',
        path: '/Path/To/Folder'
      },
      fileCreated: {
        _id: 'fileId00',
        name: 'fileName00'
      },
      isLoading: false
    })
  })
})
