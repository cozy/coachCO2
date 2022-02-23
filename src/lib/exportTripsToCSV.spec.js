import { exportTripsToCSV } from 'src/lib/exportTripsToCSV'
import { getOrCreateAppFolderWithReference } from 'src/lib/getOrCreateAppFolderWithReference'
import { mockTimeserie, mockSerie } from 'test/mockTrip'

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
    }
  }
}))

// TODO Add other tests for the another functions at file
describe('exportTripsToCSV', () => {
  const t = jest.fn()
  const mockClient = (mockData = []) => {
    const client = {
      query: jest.fn(() => ({
        data: [mockData]
      }))
    }
    return client
  }
  getOrCreateAppFolderWithReference.mockReturnValue({
    _id: 'folderId00',
    path: '/Path/To/Folder'
  })

  it('should return correctly formatted trips for the CSV file', async () => {
    const mockData = mockTimeserie('timeserieId01', [mockSerie()])
    const client = mockClient(mockData)
    let tripCSV = await exportTripsToCSV(client, t, 'test')

    expect(tripCSV).toMatchObject({
      appFolder: {
        _id: 'folderId00',
        path: '/Path/To/Folder'
      },
      file: {
        _id: 'fileId00',
        name: 'fileName00'
      }
    })
  })
})
