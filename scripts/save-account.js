/* eslint-disable no-console */
const crypto = require('crypto')

const { ArgumentParser } = require('argparse')

const { createClientInteractive } = require('cozy-client')

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

  const accountType = ACCOUNT_TYPES[crypto.randomInt(0, ACCOUNT_TYPES.length)]
  const account = {
    _type: ACCOUNTS_DOCTYPE,
    _id: crypto.randomBytes(16).toString('hex'),
    account_type: args.account_type || accountType,
    auth: {
      credentials_encrypted: crypto.randomBytes(16).toString('hex'),
      login: args.login,
      providerId: '0'
    },
    data: {
      lastSavedManualDate: new Date().toISOString(),
      lastSavedTripDate: new Date('2024-01-10').toISOString()
    },
    identifier: 'login',
    state: null
  }

  await client.save(account)
  console.log(
    `Account ${account.auth.login} saved with id ${account._id} and type ${account.account_type}`
  )
}

main().catch(e => console.error(e))
