import React from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Typography from 'cozy-ui/transpiled/react/Typography'

const ModesView = () => {
  const { t } = useI18n()

  return (
    <>
      <Typography variant="h3" className="u-mv-1-half-s u-ml-1-s u-mv-2 u-ml-2">
        {t('analysis.mode')}
      </Typography>
    </>
  )
}

export default ModesView
