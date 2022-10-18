import React from 'react'
import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom'

import flag from 'cozy-flags'

import Trips from 'src/components/Views/Trips'
import Trip from 'src/components/Views/Trip'
import ModeAnalysis from 'src/components/Views/ModeAnalysis'
import PurposeAnalysis from 'src/components/Views/PurposeAnalysis'
import Settings from 'src/components/Views/Settings'
import BikeGoal from 'src/components/Views/BikeGoal'
import BikeGoalOnboarding from 'src/components/Views/BikeGoalOnboarding'
import BikeGoalAbout from 'src/components/Views/BikeGoalAbout'

const OutletWrapper = ({ Component }) => (
  <>
    <Component />
    <Outlet />
  </>
)

const AppRouter = () => {
  const location = useLocation()
  const background = location?.state?.background
  const currentYear = new Date().getFullYear()

  return (
    <>
      <Routes location={background || location}>
        <Route path="trips" element={<OutletWrapper Component={Trips} />}>
          <Route path=":timeserieId" element={<Trip />} />
        </Route>

        <Route path="settings" element={<Settings />} />

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
            </Route>
            <Route
              path="bikegoal/onboarding"
              element={<OutletWrapper Component={BikeGoalOnboarding} />}
            />
          </>
        )}

        {/* // redirection */}
        <Route
          path="analysis"
          element={<Navigate replace to="/analysis/modes" />}
        />
        {flag('coachco2.bikegoal.enabled') && (
          <Route
            path="bikegoal/*"
            element={<Navigate replace to={`/bikegoal/${currentYear}/trips`} />}
          />
        )}
        <Route path="*" element={<Navigate replace to="/trips" />} />
      </Routes>

      {background && (
        <Routes>
          <Route path="trips/:timeserieId" element={<Trip />} />
          <Route path="analysis/modes/:mode/:timeserieId" element={<Trip />} />
          <Route
            path="analysis/purposes/:purpose/:timeserieId"
            element={<Trip />}
          />
          {flag('coachco2.bikegoal.enabled') && (
            <>
              <Route
                path="bikegoal/:year/trips/:timeserieId"
                element={<Trip />}
              />
              <Route
                path="bikegoal/onboarding"
                element={<BikeGoalOnboarding />}
              />
              <Route path="bikegoal/about" element={<BikeGoalAbout />} />
            </>
          )}
        </Routes>
      )}
    </>
  )
}

export default AppRouter
