const { Q } = require('cozy-client')

const getSourceAccount = async ({ client, args }) => {
  if (args.source_account) {
    return args.source_account
  }

  const { data: accounts } = await client.query(
    Q('io.cozy.accounts').where({
      account_type: {
        $or: ['tracemob', 'openpath']
      }
    })
  )

  if (accounts.length === 0) {
    throw new Error('No account found; please create one')
  }

  if (accounts.length === 1) {
    return accounts[0]._id
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

  return accountFound._id
}

module.exports = {
  getSourceAccount
}
