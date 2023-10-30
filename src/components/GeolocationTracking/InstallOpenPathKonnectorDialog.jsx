import React from 'react'

import { useClient, generateWebLink } from 'cozy-client'
import AppLinker from 'cozy-ui/transpiled/react/AppLinker'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const InstallOpenPathKonnectorDialog = ({ setShowOpenPathKonnectorDialog }) => {
  const { t } = useI18n()
  const client = useClient()

  const nativePath = '/discover/openpath?type=konnector'
  const slug = 'store'
  const cozyURL = new URL(client.getStackClient().uri)
  const { subdomain: subDomainType } = client.getInstanceOptions()

  return (
    <ConfirmDialog
      open
      content={t(
        'geolocationTracking.installOpenPathKonnectorDialog.description'
      )}
      actions={
        <>
          <Button
            variant="secondary"
            label={t(
              'geolocationTracking.installOpenPathKonnectorDialog.cancel'
            )}
            onClick={() => {
              setShowOpenPathKonnectorDialog(false)
            }}
          />
          <AppLinker
            app={{ slug }}
            nativePath={nativePath}
            href={generateWebLink({
              pathname: '/',
              cozyUrl: cozyURL.origin,
              slug,
              hash: nativePath,
              subDomainType
            })}
          >
            {({ onClick, href }) => (
              <Button
                variant="primary"
                label={t(
                  'geolocationTracking.installOpenPathKonnectorDialog.install'
                )}
                onClick={onClick}
                href={href}
              />
            )}
          </AppLinker>
        </>
      }
      onClose={() => setShowOpenPathKonnectorDialog(false)}
    />
  )
}

export default InstallOpenPathKonnectorDialog
