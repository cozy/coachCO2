import { pdf } from '@react-pdf/renderer'
import { getOrCreateAppFolderWithReference } from 'src/lib/getOrCreateAppFolderWithReference'

import { uploadFileWithConflictStrategy } from 'cozy-client/dist/models/file'
import log from 'cozy-logger'

/**
 * Save PDF certificate
 * @param {Object} opts - Options
 * @param {import('cozy-client/types/CozyClient').default} opts.client - CozyClient instance
 * @param {Function} opts.t - Translation function
 * @param {Object} opts.pdfDocument - PDF document
 * @param {number} opts.year - Year of the document
 * @returns {Promise<import('cozy-client/types/types').FileDocument>} - File created
 */
export const savePdfCertificate = async ({ client, t, pdfDocument, year }) => {
  try {
    const blob = await pdf(pdfDocument).toBlob()
    const { _id: appFolderId } = await getOrCreateAppFolderWithReference(
      client,
      t
    )
    const { data: fileCreated } = await uploadFileWithConflictStrategy(
      client,
      blob,
      {
        name: t('PDF.name', { year }),
        contentType: 'application/pdf',
        dirId: appFolderId,
        conflictStrategy: 'rename'
      }
    )

    return fileCreated
  } catch (error) {
    log('error', error, 'savePdfCertificate')
    return null
  }
}
