import React from 'react'
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import AppLayout from 'src/components/AppLayout'
import CertificateGeneration from 'src/components/Goals/BikeGoal/Certificate/CertificateGeneration'
import BikeGoal from 'src/components/Views/BikeGoal'
import BikeGoalAbout from 'src/components/Views/BikeGoalAbout'
import BikeGoalEdit from 'src/components/Views/BikeGoalEdit'
import BikeGoalOnboarding from 'src/components/Views/BikeGoalOnboarding'
import ModeAnalysis from 'src/components/Views/ModeAnalysis'
import PurposeAnalysis from 'src/components/Views/PurposeAnalysis'
import Settings from 'src/components/Views/Settings'
import Trip from 'src/components/Views/Trip'
import Trips from 'src/components/Views/Trips'

import flag from 'cozy-flags'

const OutletWrapper = ({ Component }) => (
  <>
    <Component />
    <Outlet />
  </>
)

const AppRouter = () => {
  const currentYear = new Date().getFullYear()

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route path="trips" element={<OutletWrapper Component={Trips} />}>
            <Route path=":timeserieId" element={<Trip />} />
            {flag('coachco2.bikegoal.enabled') && (
              <Route
                path="bikegoalonboarding"
                element={<BikeGoalOnboarding />}
              />
            )}
          </Route>

          <Route
            path="settings"
            element={<OutletWrapper Component={Settings} />}
          >
            {flag('coachco2.bikegoal.enabled') && (
              <Route
                path="bikegoalonboarding"
                element={<BikeGoalOnboarding />}
              />
            )}
          </Route>

          <Route
            path="analysis/modes"
            element={<OutletWrapper Component={ModeAnalysis} />}
          />
          <Route
            path="analysis/modes/:mode"
            element={<OutletWrapper Component={ModeAnalysis} />}
          >
            <Route path=":timeserieId" element={<Trip />} />
          </Route>

          <Route
            path="analysis/purposes"
            element={<OutletWrapper Component={PurposeAnalysis} />}
          />
          <Route
            path="analysis/purposes/:purpose"
            element={<OutletWrapper Component={PurposeAnalysis} />}
          >
            <Route path=":timeserieId" element={<Trip />} />
          </Route>

          {flag('coachco2.bikegoal.enabled') && (
            <>
              <Route
                path="bikegoal/:year/trips"
                element={<OutletWrapper Component={BikeGoal} />}
              >
                <Route path=":timeserieId" element={<Trip />} />
                <Route path="edit" element={<BikeGoalEdit />} />
                <Route path="about" element={<BikeGoalAbout />} />
                <Route
                  path="certificate/generate"
                  element={<CertificateGeneration />}
                />
              </Route>
            </>
          )}

          {/* redirection */}
          <Route
            path="analysis"
            element={<Navigate replace to="/analysis/modes" />}
          />
          {flag('coachco2.bikegoal.enabled') && (
            <Route
              path="bikegoal"
              element={
                <Navigate replace to={`/bikegoal/${currentYear}/trips`} />
              }
            />
          )}
          <Route path="/" element={<Navigate replace to="/trips" />} />
          <Route path="*" element={<Navigate replace to="/trips" />} />
          {/* redirection - end */}
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default AppRouter
