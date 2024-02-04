/* eslint-disable no-console */

const { ArgumentParser } = require('argparse')

const { createClientInteractive, Q } = require('cozy-client')

const {
  CCO2_SETTINGS_DOCTYPE,
  ACCOUNTS_DOCTYPE,
  ACCOUNT_TYPES,
  COZY_CLIENT_CLI
} = require('./helpers')

global.fetch = require('node-fetch') // in the browser we have native fetch

const confirm = readline => {
  const accountTypesStr = ACCOUNT_TYPES.join(', ')

  return new Promise(resolve => {
    readline.question(
      `This account types will be removed: ${accountTypesStr} \nType "yes" if ok.`,
      input => resolve(input)
    )
  })
}

const main = async () => {
  const parser = new ArgumentParser()
  parser.add_argument('-u', '--url', {
    default: 'http://cozy.localhost:8080',
    help: 'Use custom url. Default: http://cozy.localhost:8080'
  })
  const args = parser.parse_args()

  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })
  const userConfirmation = await confirm(readline)

  if (userConfirmation !== 'yes') {
    console.log('Aborted')
    readline.close()
    return
  }

  const client = await createClientInteractive({
    scope: [ACCOUNTS_DOCTYPE, CCO2_SETTINGS_DOCTYPE],
    uri: args.url,
    schema: {},
    oauth: {
      softwareID: COZY_CLIENT_CLI
    }
  })

  const { data: accounts } = await client.query(
    Q(ACCOUNTS_DOCTYPE).partialIndex({
      account_type: {
        $or: ACCOUNT_TYPES
      }
    })
  )

  for (const account of accounts) {
    await client.destroy(account)
    console.log(`Account ${account._id} destroyed`)
  }

  const { data: appSettings } = await client.query(Q(CCO2_SETTINGS_DOCTYPE))
  if (appSettings[0]) {
    const newAppSetting = {
      ...appSettings[0],
      account: null
    }
    await client.save(newAppSetting)
    console.log('The account has been deleted from the app settings')
  }

  readline.close()
}

main().catch(e => console.error(e))
