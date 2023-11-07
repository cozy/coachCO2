import React from 'react'
import { makeWelcomeText } from 'src/components/EmptyContent/helpers'
import { getSource } from 'src/components/Goals/BikeGoal/helpers'
import { useGeolocationTracking } from 'src/components/Providers/GeolocationTrackingProvider'
import Titlebar from 'src/components/Titlebar'

import { useClient } from 'cozy-client'
import flag from 'cozy-flags'
import AppIcon from 'cozy-ui/transpiled/react/AppIcon'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Empty from 'cozy-ui/transpiled/react/Empty'
import Typography from 'cozy-ui/transpiled/react/Typography'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const styles = {
  typography: {
    whiteSpace: 'pre-line'
  }
}

const Welcome = () => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const client = useClient()
  const { checkPermissionsAndEnableTrackingOrShowDialog } =
    useGeolocationTracking()
  const { sourceName, sourceType } = getSource()

  const text = makeWelcomeText()

  return (
    <>
      {isMobile && <Titlebar label={client.appMetadata.slug} />}
      <Empty
        data-testid="EmptyContent"
        className={isMobile ? 'u-p-1' : 'u-flex-justify-start u-p-3'}
        icon={<AppIcon app="coachco2" />}
        iconSize="large"
        title={t('emptyContent.welcome.title')}
        text={
          <Typography
            style={styles.typography}
            variant="inherit"
            color="inherit"
          >
            {t(`emptyContent.welcome.${text}`, {
              maxDaysToCapture: flag('coachco2.max-days-to-capture'),
              sourceType,
              sourceName
            })}
          </Typography>
        }
        centered
      >
        <Button
          className="u-mt-1"
          label={t('emptyContent.welcome.action')}
          onClick={async () =>
            await checkPermissionsAndEnableTrackingOrShowDialog()
          }
        />
      </Empty>
    </>
  )
}

export default Welcome
