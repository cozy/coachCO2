import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import Trips from 'src/components/Views/Trips'
import Trip from 'src/components/Views/Trip'
import ModeAnalysis from 'src/components/Views/ModeAnalysis'
import PurposeAnalysis from 'src/components/Views/PurposeAnalysis'
import Settings from 'src/components/Views/Settings'

const AppRouteur = () => {
  return (
    <Routes>
      <Route path="trip/:timeserieId" element={<Trip />} />
      <Route path="trips" element={<Trips />} />
      <Route path="settings" element={<Settings />} />
      <Route path="analysis/modes/:mode/trip/:timeserieId" element={<Trip />} />
      <Route path="analysis/modes" element={<ModeAnalysis />}>
        <Route path=":mode" element={<ModeAnalysis />} />
      </Route>
      <Route
        path="analysis/purposes/:purpose/trip/:timeserieId"
        element={<Trip />}
      />
      <Route path="analysis/purposes" element={<PurposeAnalysis />}>
        <Route path=":purpose" element={<PurposeAnalysis />} />
      </Route>
      <Route
        path="analysis"
        element={<Navigate replace to="/analysis/modes" />}
      />
      <Route path="*" element={<Navigate replace to="/trips" />} />
    </Routes>
  )
}

export default AppRouteur
