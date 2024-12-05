const rsbuild = require('@rsbuild/core')
const configCozyApp = require('rsbuild-config-cozy-app')

const config = configCozyApp.getRsbuildConfig({
  title: 'Coach CO2',
  hasServices: true
})

export default rsbuild.defineConfig(config)
