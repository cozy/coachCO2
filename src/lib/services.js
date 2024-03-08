import { APP_SLUG } from 'src/constants'
import { JOBS_DOCTYPE } from 'src/doctypes'

import { initTranslation } from 'cozy-ui/transpiled/react/providers/I18n'

const DEFAULT_LANG = 'en'

const dictRequire = lang => {
  let res
  try {
    res = require(`locales/${lang}`)
  } catch (error) {
    res = require(`locales/${DEFAULT_LANG}`)
  }
  return res
}

/**
 * Init polyglot and returns t
 * @returns {object}
 */
export const initPolyglot = () => {
  const lang = process.env.COZY_LOCALE || DEFAULT_LANG
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
