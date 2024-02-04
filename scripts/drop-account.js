/* eslint-disable no-console */
const { ArgumentParser } = require('argparse')

const { createClientInteractive, Q } = require('cozy-client')

const {
  ACCOUNTS_DOCTYPE,
  COZY_CLIENT_CLI,
  GEOJSON_DOCTYPE,
  CCO2_SETTINGS_DOCTYPE,
  ACCOUNT_TYPES
} = require('./helpers')

global.fetch = require('node-fetch') // in the browser we have native fetch

const main = async () => {
  const parser = new ArgumentParser()
  parser.add_argument('--source-account', {
    required: true,
    help: 'Use custom source account'
  })
  parser.add_argument('-u', '--url', {
    default: 'http://cozy.localhost:8080',
    help: 'Use custom url. Default: http://cozy.localhost:8080'
  })
  const args = parser.parse_args()

  const client = await createClientInteractive({
    scope: [ACCOUNTS_DOCTYPE, GEOJSON_DOCTYPE, CCO2_SETTINGS_DOCTYPE],
    uri: args.url,
    schema: {},
    oauth: {
      softwareID: COZY_CLIENT_CLI
    }
  })

  // #region Queries
  const { data: accounts } = await client.query(
    Q(ACCOUNTS_DOCTYPE).partialIndex({
      account_type: {
        $or: ACCOUNT_TYPES
      }
    })
  )
  const accountWanted = accounts.find(
    account => account._id === args.source_account
  )
  if (!accountWanted) {
    throw new Error(`Account ${args.source_account} not found`)
  }

  const { data: appSettings } = await client.query(
    Q(CCO2_SETTINGS_DOCTYPE).where({
      account: {
        _id: args.source_account
      }
    })
  )

  const { data: timeseries } = await client.query(
    Q(GEOJSON_DOCTYPE).where({
      cozyMetadata: {
        sourceAccount: args.source_account
      }
    })
  )
  // #endregion Queries

  // Manage app settings
  if (appSettings[0]) {
    if (accounts.length > 1) {
      // Switch to another account found
      const otherAccounts = accounts.filter(
        account => account._id !== args.source_account
      )
      await client.save({
        ...appSettings[0],
        account: otherAccounts[0]
      })
      console.log(
        `Default account on app setting is switch to ${otherAccounts[0]._id} (${otherAccounts[0].auth.login})`
      )
    } else if (accounts.length === 1) {
      // No account left,
      await client.save({
        ...appSettings[0],
        account: null
      })
      console.log('The account has been deleted from the app settings')
    }
  }

  // Manage timeseries
  for (const timeserie of timeseries) {
    await client.destroy(timeserie)
  }
  console.log(`${timeseries.length} related timeseries destroyed`)

  // Manage account
  await client.destroy(accountWanted)
  console.log(`Account ${accountWanted._id} destroyed`)
}

main().catch(e => console.error(e))
