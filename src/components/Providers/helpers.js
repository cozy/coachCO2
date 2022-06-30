import { SETTINGS_DOCTYPE } from 'src/doctypes'

export const saveAccountToSettings = ({ client, setting, account }) =>
  client.save({
    ...setting,
    account,
    _type: SETTINGS_DOCTYPE
  })
