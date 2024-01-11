require('@babel/polyfill')

// polyfill for requestAnimationFrame
/* istanbul ignore next */
global.requestAnimationFrame = cb => {
  setTimeout(cb, 0)
}

jest.mock('cozy-harvest-lib/dist/models/ConnectionFlow', () => () => ({
  createAccountSilently: jest.fn()
}))

jest.mock('cozy-intent', () => ({
  ...jest.requireActual('cozy-intent'),
  useWebviewIntent: () => ({
    call: name => {
      if (name === 'getGeolocationTrackingStatus') return { enabled: false }
    }
  })
}))
