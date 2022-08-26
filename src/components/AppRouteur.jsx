import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import Trips from 'src/components/Views/Trips'
import Trip from 'src/components/Views/Trip'
import ModeAnalysis from 'src/components/Views/ModeAnalysis'
import PurposeAnalysis from 'src/components/Views/PurposeAnalysis'
import Settings from 'src/components/Views/Settings'

const AppRouteur = () => {
  return (
    <Switch>
      <Route path="/trip/:timeserieId" component={Trip} />
      <Route path="/trips" component={Trips} />
      <Route path="/settings" component={Settings} />
      <Route path="/analysis/modes/:mode" component={ModeAnalysis} />
      <Route path="/analysis/modes" component={ModeAnalysis}></Route>
      <Route path="/analysis/purposes/:purpose" component={PurposeAnalysis} />
      <Route path="/analysis/purposes" component={PurposeAnalysis} />
      <Redirect from="/analysis" to="/analysis/modes" />
      <Redirect from="/" to="/trips" />
      <Redirect from="*" to="/trips" />
    </Switch>
  )
}

export default AppRouteur
