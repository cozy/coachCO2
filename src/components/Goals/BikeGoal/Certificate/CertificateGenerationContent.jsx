import React from 'react'
import { useParams } from 'react-router-dom'

import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Paper from 'cozy-ui/transpiled/react/Paper'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import Icon from 'cozy-ui/transpiled/react/Icon'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import FileTypePdfIcon from 'cozy-ui/transpiled/react/Icons/FileTypePdf'

import BikeGoalChart from 'src/components/Goals/BikeGoal/BikeGoalChart'
import { getBountyAmount } from 'src/components/Goals/BikeGoal/helpers'

import styles from 'src/components/Goals/BikeGoal/Certificate/CertificateGeneration.styl'

const CertificateGenerationContent = () => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const { year } = useParams()

  return (
    <div className={styles['CertificateGeneration-root']}>
      <BikeGoalChart {...(isMobile && { size: 'medium' })} />
      <Typography variant="h4">
        {t('bikeGoal.certificateGeneration.title')}
      </Typography>
      <Typography variant="body2" className="u-mv-1">
        {t('bikeGoal.certificateGeneration.content', {
          bountyAmount: getBountyAmount(),
          year
        })}
      </Typography>
      <Paper>
        <List>
          <ListItem>
            <ListItemIcon>
              <Icon icon={FileTypePdfIcon} size={32} />
            </ListItemIcon>
            <ListItemText
              primary={t('bikeGoal.certificateGeneration.actions.show')}
            />
          </ListItem>
        </List>
      </Paper>
      <Button
        variant="text"
        label={t('bikeGoal.certificateGeneration.actions.generate')}
        className="u-mt-half u-fz-xsmall"
        onClick={() => {
          // TODO
        }}
      />
    </div>
  )
}

export default CertificateGenerationContent
