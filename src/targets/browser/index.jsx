import 'cozy-ui/transpiled/react/stylesheet.css'
import 'cozy-ui/dist/cozy-ui.utils.min.css'

import 'src/styles/index.styl'

import React from 'react'
import { render } from 'react-dom'

import setupApp from 'src/targets/browser/setupApp'
import { register as registerServiceWorker } from 'src/targets/browser/serviceWorkerRegistration'
import AppProviders from 'src/components/AppProviders'
import App from 'src/components/App'

const init = function () {
  const { container, client, lang, polyglot } = setupApp()

  render(
    <AppProviders client={client} lang={lang} polyglot={polyglot}>
      <App />
    </AppProviders>,
    container
  )
}

registerServiceWorker()

document.addEventListener('DOMContentLoaded', () => {
  init()
})

if (module.hot) {
  init()
  module.hot.accept()
}
