import React from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import OpenwithIcon from 'cozy-ui/transpiled/react/Icons/Openwith'
import Link from 'cozy-ui/transpiled/react/Link'
import Typography from 'cozy-ui/transpiled/react/Typography'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const makeFAQHelpStyle = isDesktop => ({
  position: 'fixed',
  width: '100%',
  textAlign: 'center',
  bottom: 'calc(var(--safe-area-inset-bottom) + 4rem)',
  ...(isDesktop && {
    left: 'calc(var(--safe-area-inset-left) + calc(13.75rem / 2))'
  })
})

const FAQHelp = () => {
  const { t } = useI18n()
  const { isDesktop } = useBreakpoints()
  const FAQHelpStyle = makeFAQHelpStyle(isDesktop)

  return (
    <div style={FAQHelpStyle}>
      <Typography>{t('support.problem')}</Typography>
      <Typography>
        {t('support.consult.text')}{' '}
        <Link
          target="_blank"
          href="https://support.cozy.io/tag/cozy-coach-co2/"
        >
          {t('support.consult.link')}{' '}
          <IconButton size="small" color="inherit">
            <Icon icon={OpenwithIcon} />
          </IconButton>
        </Link>
      </Typography>
    </div>
  )
}

export default FAQHelp
