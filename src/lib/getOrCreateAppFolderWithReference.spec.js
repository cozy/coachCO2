import { getOrCreateAppFolderWithReference } from 'src/lib/getOrCreateAppFolderWithReference'

import { models } from 'cozy-client'

const { ensureMagicFolder, getReferencedFolder } = models.folder

jest.mock('cozy-client', () => ({
  ...jest.requireActual('cozy-client'),
  models: {
    folder: {
      ensureMagicFolder: jest.fn(),
      getReferencedFolder: jest.fn()
    }
  }
}))

const setup = referencedFilesRes => {
  ensureMagicFolder.mockReturnValue(referencedFilesRes)
  getReferencedFolder.mockReturnValue(referencedFilesRes)
}

// TODO Add all tests (https://github.com/cozy/coachCO2/pull/62#discussion_r812710842)
describe('getFolderWithReference', () => {
  it('should get folder with reference', async () => {
    const referencedFilesRes = {
      id: 'fileId',
      dir_id: 'dirId',
      path: '/file_path'
    }
    setup(referencedFilesRes)

    const res = await getOrCreateAppFolderWithReference()
    expect(res).toEqual({ id: 'fileId', dir_id: 'dirId', path: '/file_path' })
  })
})
