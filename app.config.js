const path = require('path')

const config = [
  require('cozy-scripts/config/webpack.bundle.default.js'),
  require('cozy-scripts/config/webpack.config.css-modules'),
  require('./app.config.babel-loader-leaflet'),
  {
    resolve: {
      alias: {
        'react-pdf$': 'react-pdf/dist/esm/entry.webpack',
        root: path.resolve(__dirname)
      }
    }
  }
]

module.exports = config
