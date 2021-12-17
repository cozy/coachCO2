import React from 'react'

import { makeStyles } from '@material-ui/styles'

import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import ModeList from 'src/components/SectionEditModal/ModeList'

const useStyles = makeStyles(() => ({
  root: {
    zIndex: '99999 !important'
  }
}))

const SectionEditModal = ({ section, showModal }) => {
  const classes = useStyles()
  const { t } = useI18n()

  return (
    <Dialog
      open={true}
      onClose={() => showModal(false)}
      classes={{ root: classes.root }}
      title={t('tripEdit.selectMode')}
      content={
        <ModeList section={section} closeModal={() => showModal(false)} />
      }
    />
  )
}

export default React.memo(SectionEditModal)
