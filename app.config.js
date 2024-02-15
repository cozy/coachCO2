const path = require('path')

const cozyNotificationsWebpackConfig = require('cozy-notifications/dist/webpack/config')
const VersionPlugin = require('cozy-scripts/plugins/VersionPlugin')

const config = [
  require('cozy-scripts/config/webpack.bundle.default.js'),
  require('cozy-scripts/config/webpack.config.css-modules'),
  require('./app.config.babel-loader-leaflet'),
  {
    plugins: [
      new VersionPlugin({
        packages: [
          'cozy-bar',
          'cozy-client',
          'cozy-device-helper',
          'cozy-flags',
          'cozy-harvest-lib',
          'cozy-intent',
          'cozy-keys-lib',
          'cozy-logger',
          'cozy-minilog',
          'cozy-notifications',
          'cozy-realtime',
          'cozy-ui',
          'cozy-ach',
          'cozy-jobs-cli',
          'cozy-scripts'
        ]
      })
    ],
    resolve: {
      alias: {
        'react-pdf$': 'react-pdf/dist/esm/entry.webpack',
        root: path.resolve(__dirname)
      }
    }
  }
]

config.push({
  multiple: {
    services: cozyNotificationsWebpackConfig.default
  }
})

module.exports = config
