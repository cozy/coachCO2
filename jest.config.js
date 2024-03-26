process.env.TZ = 'UTC'

module.exports = {
  testURL: 'http://localhost/',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'styl'],
  setupFiles: ['<rootDir>/test/jestLib/setup.js'],
  setupFilesAfterEnv: ['<rootDir>/test/jestLib/setupAfterEnv.js'],
  moduleDirectories: ['src', 'node_modules'],
  moduleNameMapper: {
    '\\.(png|gif|jpe?g|svg)$': '<rootDir>/test/__mocks__/fileMock.js',
    // identity-obj-proxy module is installed by cozy-scripts
    '.styl$': 'identity-obj-proxy',
    '^cozy-client$': 'cozy-client/dist/index',
    '^src/(.*)': '<rootDir>/src/$1',
    '^test/(.*)': '<rootDir>/test/$1'
  },
  transformIgnorePatterns: ['node_modules/(?!cozy-ui)'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
    '\\.hbs$': '<rootDir>/node_modules/cozy-notifications/test/readFileESM.js'
  },
  globals: {
    __ALLOW_HTTP__: false,
    __TARGET__: 'browser',
    cozy: {}
  }
}
