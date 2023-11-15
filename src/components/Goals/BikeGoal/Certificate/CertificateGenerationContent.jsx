import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BikeGoalChart from 'src/components/Goals/BikeGoal/BikeGoalChart'
import styles from 'src/components/Goals/BikeGoal/Certificate/CertificateGeneration.styl'
import { PDFCertificate } from 'src/components/Goals/BikeGoal/Certificate/PDFCertificate/PDFCertificate'
import { savePdfCertificate } from 'src/components/Goals/BikeGoal/Certificate/helpers'
import {
  getName,
  getBountyAmount,
  getDaysToReach,
  getSource
} from 'src/components/Goals/BikeGoal/helpers'
import { buildSettingsQuery } from 'src/queries/queries'

import { useClient, useQuery, isQueryLoading } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import FileTypePdfIcon from 'cozy-ui/transpiled/react/Icons/FileTypePdf'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Paper from 'cozy-ui/transpiled/react/Paper'
import Typography from 'cozy-ui/transpiled/react/Typography'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const CertificateGenerationContent = ({ certificate }) => {
  const { t, lang } = useI18n()
  const client = useClient()
  const { isMobile } = useBreakpoints()
  const { year } = useParams()
  const navigate = useNavigate()
  const [isBusy, setIsBusy] = useState(false)

  const settingsQuery = buildSettingsQuery()
  const { data: settings, ...settingsQueryLeft } = useQuery(
    settingsQuery.definition,
    settingsQuery.options
  )
  const isLoading = isQueryLoading(settingsQueryLeft)

  if (isLoading) {
    return null
  }

  const handleCertificateGeneration = async () => {
    setIsBusy(true)
    const { sourceName } = getSource()
    const { givenName, familyName } = getName(settings)
    const username = `${familyName} ${givenName}`

    const pdfDocument = (
      <PDFCertificate
        t={t}
        username={username}
        daysToReach={getDaysToReach(settings)}
        sourceName={sourceName}
        year={year}
        lang={lang}
      />
    )
    await savePdfCertificate({ client, t, pdfDocument, year })

    setIsBusy(false)
  }

  const generateButtonLabel = certificate
    ? t('bikeGoal.certificateGeneration.actions.regenerate')
    : t('bikeGoal.certificateGeneration.actions.generate')

  return (
    <div className={styles['CertificateGeneration-root']}>
      <BikeGoalChart {...(isMobile && { size: 'medium' })} />
      <Typography variant="h4">
        {t('bikeGoal.certificateGeneration.title')}
      </Typography>
      <Typography variant="body2" className="u-mv-1">
        {t('bikeGoal.certificateGeneration.content', {
          smart_count: getBountyAmount() || -1,
          year
        })}
      </Typography>
      {!!certificate && !isBusy && (
        <Paper
          onClick={() => {
            navigate({
              pathname: `../certificate/${certificate._id}`
            })
          }}
          className="u-c-pointer"
        >
          <List>
            <ListItem>
              <ListItemIcon>
                <Icon icon={FileTypePdfIcon} size={32} />
              </ListItemIcon>
              <ListItemText primary={certificate.name} />
            </ListItem>
          </List>
        </Paper>
      )}
      <Button
        variant="text"
        label={generateButtonLabel}
        className="u-mt-half u-fz-xsmall"
        onClick={handleCertificateGeneration}
        busy={isBusy}
      />
    </div>
  )
}

export default CertificateGenerationContent
