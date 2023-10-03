import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FILES_DOCTYPE } from 'src/doctypes'
import { buildFileQueryById } from 'src/queries/queries'

import { useQuery, hasQueryBeenLoaded, useClient } from 'cozy-client'
import { SharingProvider } from 'cozy-sharing/dist/SharingProvider'
import 'cozy-sharing/dist/stylesheet.css'
import Backdrop from 'cozy-ui/transpiled/react/Backdrop'
import Modal from 'cozy-ui/transpiled/react/Modal'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Viewer from 'cozy-ui/transpiled/react/Viewer'
import FooterActionButtons from 'cozy-ui/transpiled/react/Viewer/Footer/FooterActionButtons'
import ForwardOrDownloadButton from 'cozy-ui/transpiled/react/Viewer/Footer/ForwardOrDownloadButton'
import SharingButton from 'cozy-ui/transpiled/react/Viewer/Footer/Sharing'

const FilesViewerWithQuery = () => {
  const { fileId } = useParams()
  const navigate = useNavigate()
  const client = useClient()

  const currentFileId = fileId ?? null
  const buildedFilesQuery = buildFileQueryById(currentFileId)
  const filesQuery = useQuery(
    buildedFilesQuery.definition,
    buildedFilesQuery.options
  )

  if (!hasQueryBeenLoaded(filesQuery)) {
    return (
      <Modal open>
        <Backdrop open>
          <Spinner
            size="xxlarge"
            middle
            noMargin
            color="var(--primaryContrastTextColor)"
          />
        </Backdrop>
      </Modal>
    )
  }

  return (
    <SharingProvider
      client={client}
      doctype={FILES_DOCTYPE}
      documentType="Files"
    >
      <Viewer
        files={filesQuery.data}
        currentIndex={0}
        onCloseRequest={() => navigate('..')}
      >
        <FooterActionButtons>
          <SharingButton />
          <ForwardOrDownloadButton />
        </FooterActionButtons>
      </Viewer>
    </SharingProvider>
  )
}

export default FilesViewerWithQuery
