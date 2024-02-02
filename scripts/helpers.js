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

  throw new Error(
    'Several accounts found, please specify one with --source-account option. Available accounts ids: ' +
      accounts.map(acc => acc._id).join(', ')
  )
}

module.exports = {
  getSourceAccount
}
