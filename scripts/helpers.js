const { Q } = require('cozy-client')

const ACCOUNTS_DOCTYPE = 'io.cozy.accounts'
const CCO2_SETTINGS_DOCTYPE = 'io.cozy.coachco2.settings'
const GEOJSON_DOCTYPE = 'io.cozy.timeseries.geojson'
const COZY_CLIENT_CLI = 'io.cozy.client.cli'
const ACCOUNT_TYPES = ['tracemob', 'openpath']

/**
 * @typedef {object} SourceAccountResponse
 * @property {string} login
 * @property {string} id
 */

/**
 * @param {import('cozy-client/types/types').AccountsDocument} account
 * @returns {SourceAccountResponse}
 */
const getSourceAccountResponse = account => {
  return { login: account.auth.login, id: account._id }
}

/**
 * @typedef {object} Args
 * @property {string} source_account
 * @property {string} login
 * @property {string} url
 * @property {string} date
 */

/**
 * Get source account
 * @param  {object} opts
 * @param  {import('cozy-client/types/CozyClient').default} opts.client
 * @param  {Args} opts.args
 * @returns {Promise<SourceAccountResponse>} source account id
 */
const getSourceAccount = async ({ client, args }) => {
  if (args.source_account) {
    const { data: account } = await client.query(
      Q(ACCOUNTS_DOCTYPE).getById(args.source_account),
      { singleDocData: true }
    )

    return getSourceAccountResponse(account)
  }

  const { data: accounts } = await client.query(
    Q(ACCOUNTS_DOCTYPE).partialIndex({
      account_type: {
        $or: ACCOUNT_TYPES
      }
    })
  )

  if (accounts.length === 0) {
    throw new Error('No account found; please create one')
  }

  if (accounts.length === 1) {
    return getSourceAccountResponse(accounts[0])
  }

  if (!args.login) {
    throw new Error(
      `Several accounts found: please provide one with --source-account or --login: ${JSON.stringify(
        accounts.map(account => ({
          _id: account._id,
          login: account.auth.login
        }))
      )}`
    )
  }

  const accountFound = accounts.find(
    account => account.auth.login === args.login
  )
  if (!accountFound) {
    throw new Error(
      `No account found with login: ${
        args.login
      }; Existing account login: ${accounts
        .map(account => account.auth.login)
        .join(', ')}`
    )
  }

  return getSourceAccountResponse(accountFound)
}

module.exports = {
  getSourceAccount,
  ACCOUNTS_DOCTYPE,
  CCO2_SETTINGS_DOCTYPE,
  ACCOUNT_TYPES,
  GEOJSON_DOCTYPE,
  COZY_CLIENT_CLI
}
