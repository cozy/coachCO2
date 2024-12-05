const getDataOrDefault = (data, defaultData) => {
  return /^\{\{\..*\}\}$/.test(data) ? defaultData : data
}

/**
 * default data will allow to display correctly the cozy-bar
 * in the standalone (without cozy-stack connexion)
 */
export const getValues = ({ locale }) => {
  const defaultValues = {
    appLocaleDefault: 'en'
  }

  return {
    lang: getDataOrDefault(locale, defaultValues.appLocaleDefault)
  }
}
