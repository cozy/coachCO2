import React from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import HelpIcon from 'cozy-ui/transpiled/react/Icons/Help'
import OpenwithIcon from 'cozy-ui/transpiled/react/Icons/Openwith'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const FAQItem = () => {
  const { t } = useI18n()

  return (
    <ListItem
      button
      ellipsis={false}
      component="a"
      target="_blank"
      href="https://support.cozy.io/tag/cozy-coach-co2/"
    >
      <ListItemIcon>
        <Icon icon={HelpIcon} />
      </ListItemIcon>
      <ListItemText primary={t('support.consult.link')} />
      <ListItemIcon>
        <Icon icon={OpenwithIcon} />
      </ListItemIcon>
    </ListItem>
  )
}

export default FAQItem
