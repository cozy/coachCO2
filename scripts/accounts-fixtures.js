const crypto = require('crypto')

const { ACCOUNTS_DOCTYPE } = require('./helpers')

module.exports = ({ accountType, login, token }) => {
  const isOpenpathAccount = accountType === 'openpath'
  return {
    _type: ACCOUNTS_DOCTYPE,
    _id: crypto.randomBytes(16).toString('hex'),
    account_type: accountType,
    auth: {
      ...(!isOpenpathAccount && {
        credentials_encrypted: crypto.randomBytes(16).toString('hex')
      }),
      login,
      providerId: '0'
    },
    ...(isOpenpathAccount && { token }),
    data: {
      lastSavedManualDate: new Date().toISOString(),
      lastSavedTripDate: new Date('2024-01-10').toISOString()
    },
    identifier: 'login',
    state: null
  }
}
