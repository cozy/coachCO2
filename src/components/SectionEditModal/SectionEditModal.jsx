import React from 'react'

import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import ModeList from 'src/components/SectionEditModal/ModeList'

const SectionEditModal = ({ section, showModal }) => {
  const { t } = useI18n()

  return (
    <Dialog
      open={true}
      onClose={() => showModal(false)}
      title={t('tripEdit.selectMode')}
      content={
        <ModeList section={section} closeModal={() => showModal(false)} />
      }
    />
  )
}

export default React.memo(SectionEditModal)
