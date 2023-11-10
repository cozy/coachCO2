import React from 'react'
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import ModesList from 'src/components/Analysis/Modes/ModesList'
import PurposesList from 'src/components/Analysis/Purposes/PurposesList'
import AppLayout from 'src/components/AppLayout'
import CertificateGeneration from 'src/components/Goals/BikeGoal/Certificate/CertificateGeneration'
import { ListWrapper } from 'src/components/ListWrapper'
import BikeGoal from 'src/components/Views/BikeGoal'
import BikeGoalAbout from 'src/components/Views/BikeGoalAbout'
import BikeGoalEdit from 'src/components/Views/BikeGoalEdit'
import BikeGoalOnboarding from 'src/components/Views/BikeGoalOnboarding'
import Settings from 'src/components/Views/Settings'
import Trip from 'src/components/Views/Trip'
import Trips from 'src/components/Views/Trips'

import flag from 'cozy-flags'

import FilesViewerWithQuery from './FileViewerWithQuery'

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
            <Route
              path="certificate/:fileId"
              element={<FilesViewerWithQuery />}
            />
            <Route
              path=":year/certificate/generate"
              element={<CertificateGeneration />}
            />
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
          <Route path="analysis/" element={<ListWrapper />}>
            <Route
              path="modes"
              element={<OutletWrapper Component={ModesList} />}
            />
            <Route
              path="modes/:mode"
              element={<OutletWrapper Component={ModesList} />}
            >
              <Route path=":timeserieId" element={<Trip />} />
            </Route>

            <Route
              path="purposes"
              element={<OutletWrapper Component={PurposesList} />}
            />
            <Route
              path="purposes/:purpose"
              element={<OutletWrapper Component={PurposesList} />}
            >
              <Route path=":timeserieId" element={<Trip />} />
            </Route>
          </Route>
          {flag('coachco2.bikegoal.enabled') && (
            <>
              <Route
                path="bikegoal/:year/trips"
                element={<OutletWrapper Component={BikeGoal} />}
              >
                <Route
                  path="certificate/:fileId"
                  element={<FilesViewerWithQuery />}
                />
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
