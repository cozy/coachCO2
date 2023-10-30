require('@babel/polyfill')

// polyfill for requestAnimationFrame
/* istanbul ignore next */
global.requestAnimationFrame = cb => {
  setTimeout(cb, 0)
}

/* Fix error: "Material-UI: The color provided to augmentColor(color) is invalid.
The color object needs to have a `main` property or a `500` property."*/
jest.mock('cozy-ui/transpiled/react/utils/color', () => ({
  getCssVariableValue: () => '#fff',
  getInvertedCssVariableValue: () => '#fff'
}))

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
