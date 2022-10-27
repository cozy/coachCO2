import React from 'react'
import { HashRouter } from 'react-router-dom'

import AppRouter from 'src/components/AppRouter'

const App = () => {
  return (
    <HashRouter>
      <AppRouter />
    </HashRouter>
  )
}

/*
  Enable Hot Module Reload using `react-hot-loader` here
  We enable it here since App is the main root component
  No need to use it anywhere else, it sould work for all
  child components
*/
export default React.memo(App)
