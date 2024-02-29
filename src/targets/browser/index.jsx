/* eslint-disable import/order */
import 'cozy-ui/transpiled/react/stylesheet.css'
import 'cozy-ui/dist/cozy-ui.utils.min.css'
import 'cozy-bar/dist/stylesheet.css'

import 'src/styles/index.styl'
import React from 'react'
import { createRoot } from 'react-dom/client'
import AppProviders from 'src/components/AppProviders'
import AppRouter from 'src/components/AppRouter'
import { register as registerServiceWorker } from 'src/targets/browser/serviceWorkerRegistration'
import setupApp from 'src/targets/browser/setupApp'

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
