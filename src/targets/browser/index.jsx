import 'cozy-ui/transpiled/react/stylesheet.css'
import 'cozy-ui/dist/cozy-ui.utils.min.css'

import 'src/styles/index.styl'

import React from 'react'
import { createRoot } from 'react-dom/client'

import setupApp from 'src/targets/browser/setupApp'
import { register as registerServiceWorker } from 'src/targets/browser/serviceWorkerRegistration'
import AppProviders from 'src/components/AppProviders'
import AppRouter from 'src/components/AppRouter'

const init = function () {
  const { container, client, lang, polyglot } = setupApp()
  const root = createRoot(container)

  root.render(
    <AppProviders client={client} lang={lang} polyglot={polyglot}>
      <AppRouter />
    </AppProviders>
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
