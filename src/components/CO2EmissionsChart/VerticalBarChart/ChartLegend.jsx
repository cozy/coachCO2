import React from 'react'

import Divider from 'cozy-ui/transpiled/react/Divider'
import Paper from 'cozy-ui/transpiled/react/Paper'
import Icon from 'cozy-ui/transpiled/react/Icon'
import CircleFilledIcon from 'cozy-ui/transpiled/react/Icons/CircleFilled'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

const paperStyle = {
  minHeight: '48px',
  display: 'flex',
  alignItems: 'center'
}

const ChartLegend = () => {
  const { t } = useI18n()

  return (
    <>
      <Divider />
      <Paper
        style={paperStyle}
        className="u-ph-1-s u-ph-2"
        square
        elevation={0}
      >
        <Icon
          className="u-mr-half"
          icon={CircleFilledIcon}
          color="var(--primaryColor)"
          size={8}
        />
        <Typography
          className="u-mr-1"
          display="inline"
          variant="caption"
          color="textPrimary"
        >
          {t('vericalBarChart.legend.yours')}
        </Typography>
        <Icon
          className="u-mr-half"
          icon={CircleFilledIcon}
          color="var(--borderMainColor)"
          size={8}
        />
        <Typography display="inline" variant="caption" color="textPrimary">
          {t('vericalBarChart.legend.average')}
        </Typography>
      </Paper>
    </>
  )
}

export default ChartLegend
