# 0.7.0

## ✨ Features

## 🐛 Bug Fixes

* Locales when installing the app the first time

## 🔧 Tech

# 0.6.0

## 🔧 Tech

* Add app descriptions in the manifest for the Store
* Add a message on the trips page if no tracemob account or no trip

# 0.5.0

## 🐛 Bug Fixes

* No blinking on analysis pages if more than 1000 travels
* Correctly handle not supported purposes
* Correctly handle not supported manual modes

## 🔧 Tech

* Remove icons from assets and use icons from cozy-ui

# 0.4.0

## ✨ Features

* Update cozy packages
* Home : replace the icon of a trip by the purpose's one, and displays all used modes
* Analysis: new analysis pages allowing to visualize the most CO2 consuming trips by mode and purpose
* Analysis: new pages in the analysis tab allowing to visualize the trips filtered by mode or purpose by clicking on them
* Date selector for analysis pages
* Change app icon to beta one
* Change some text for better understanding between modes and purposes
* Icons to show transport mode are now colorized
* Selected account is now stored in a doctype
* Possibility to use multiple tracemob account

## 🔧 Tech

* Remove stuffs related to default todo app
* Add fixtures to help development
* Add bunldemon (used with `yarn build && yarn bundlemon`)
* Use fullscreen modal for mobile trip view
* Some trips transformation optimization
* Update documentation
* Added 2 routes for displaying trips filtered by `mode` or `purpose`
* Add an `onBack` property on the `Titlebar` component to go back
* Renamed `makeTimeseriesIdsAndTotalCO2ByModes` to `makeTimeseriesAndTotalCO2ByModes` and return `timeseriesBy*` object instead Ids.
* Refactor TripsList & Trips components

# 0.3.0

## ✨ Features

* Add view with specific url to show a trip
* Add a bottom sheet to show trip information on the trip view
* Add mode edition to change a mode for a section in the trip view
* Add trip purpose and trip modification modals
* Add a service worker to update PWA automatically

## 🐛 Bug Fixes

* Add non breakable space to show CO2 quantity in list view and fix font size
* Add white background on PWA icon on iOS
