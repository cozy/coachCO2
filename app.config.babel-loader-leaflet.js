module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [
          {
            test: /(node_modules|cozy-(bar|client-js))/,
            exclude: [
              /node_modules\/leaflet/,
              /node_modules\/@react-leaflet/,
              /node_modules\/react-leaflet/
            ]
          }
        ],
        loader: require.resolve('cozy-scripts/node_modules/babel-loader')
      }
    ]
  }
}
