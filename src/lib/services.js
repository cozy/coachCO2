import { APP_SLUG } from 'src/constants'
import { JOBS_DOCTYPE } from 'src/doctypes'

import { initTranslation } from 'cozy-ui/transpiled/react/providers/I18n'

/**
 * Init polyglot and returns t
 * @returns {object}
 */
export const initPolyglot = () => {
  const lang = process.env.COZY_LOCALE || 'en'
  const dictRequire = lang => require(`locales/${lang}`)
  const polyglot = initTranslation(lang, dictRequire)
  const t = polyglot.t.bind(polyglot)

  return { t, lang, dictRequire }
}

export const startService = async (client, serviceName, { fields } = {}) => {
  await client.collection(JOBS_DOCTYPE).create('service', {
    name: serviceName,
    slug: APP_SLUG,
    fields
  })
}
