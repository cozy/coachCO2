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
      <Route path="/trip/:timeserieId">
        <Trip />
      </Route>
      <Route path="/trips">
        <Trips />
      </Route>
      <Route path="/settings">
        <Settings />
      </Route>
      <Route path="/analysis/modes/:mode">
        <ModeAnalysis />
      </Route>
      <Route path="/analysis/modes">
        <ModeAnalysis />
      </Route>
      <Route path="/analysis/purposes/:purpose">
        <PurposeAnalysis />
      </Route>
      <Route path="/analysis/purposes">
        <PurposeAnalysis />
      </Route>
      <Route
        path="/analysis"
        render={() => <Redirect to="/analysis/modes" />}
      />
      <Route path="*" render={() => <Redirect to="/trips" />} />
    </Switch>
  )
}

export default AppRouteur
