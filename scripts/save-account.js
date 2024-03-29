/* eslint-disable no-console */
const crypto = require('crypto')

const { ArgumentParser } = require('argparse')

const { createClientInteractive } = require('cozy-client')

const makeAccount = require('./accounts-fixtures')
const {
  ACCOUNTS_DOCTYPE,
  ACCOUNT_TYPES,
  COZY_CLIENT_CLI
} = require('./helpers')

global.fetch = require('node-fetch') // in the browser we have native fetch

const main = async () => {
  const parser = new ArgumentParser()
  parser.add_argument('--account-type', {
    choices: ACCOUNT_TYPES,
    help: `Valid source types: ${ACCOUNT_TYPES.join(', ')}`
  })
  parser.add_argument('-l', '--login', {
    required: true,
    help: 'Use custom account login'
  })
  parser.add_argument('-t', '--token', {
    help: 'Use custom account token (force openpath account)'
  })
  parser.add_argument('-u', '--url', {
    default: 'http://cozy.localhost:8080',
    help: 'Use custom url. Default: http://cozy.localhost:8080'
  })
  const args = parser.parse_args()

  const client = await createClientInteractive({
    scope: [ACCOUNTS_DOCTYPE],
    uri: args.url,
    schema: {},
    oauth: {
      softwareID: COZY_CLIENT_CLI
    }
  })

  const accountType = args.token
    ? 'openpath'
    : args.account_type ||
      ACCOUNT_TYPES[crypto.randomInt(0, ACCOUNT_TYPES.length)]

  const token = args.token || crypto.randomBytes(16).toString('hex')

  const account = makeAccount({
    accountType,
    login: args.login,
    token
  })

  await client.save(account)
  console.log(
    `Account ${account.auth.login} saved with id ${account._id} and type ${account.account_type}`
  )
}

main().catch(e => console.error(e))
