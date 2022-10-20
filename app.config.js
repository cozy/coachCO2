const config = [
  require('cozy-scripts/config/webpack.bundle.default.js'),
  require('cozy-scripts/config/webpack.config.css-modules'),
  require('./app.config.babel-loader-leaflet')
]

module.exports = config
