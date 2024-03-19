# 0.20.0

# 0.19.0

### ✨ Features

* Retain openpath trips for 30 days

### 🐛 Bug Fixes

* initPolyglot should load the "en"  as a fallback in Service
* Fix recurringPurposes queries

# 0.18.0

### ✨ Features

* Add property `isAllAccountsSelected` to `io.cozy.coachco2.settings`
* Add “All Sources” option
* Compute geojson aggregation in fetch service
* Set the choice “All sources” when loading the app
* Request openpath purge after fetch
* Adding the year to the trips subHeaders
* All purposes must offer the POI modal
* Change the text when there are no trips, in Desktop mode

### 🐛 Bug Fixes

* The arrow filter must ignore multiple occurrences of the same month
* The duplicate creation of the `io.cozy.coachco2.settings` document
* Querying all trips from all accounts query
* The export trips feature must also have the modes chosen manually
* Trip deduplication
* Use startDate sorted by asc for geolocation quota notification
* Rely on device name rather than login
* Add a missing conditions displayed the correct screen with a new account without trips
* Handle multiple service accounts
* Synchronize translations

### 🔧 Tech

* Simplify the logic of AccountProvider
* Renaming of Export queries and duplication of the query also used by a service
* Upgrade cozy-ach to 1.51.0
* Add CozyDevTools
* Add `captureDevice` property to trip fixture
* Fix trip generate by local script
* Updated the query to better reflect reality
* Add `argparse` package to devDeps
* Create `getSourceAccount` helper
* Add a login argument to select the account
* Add drop accounts script
* Add drop/save account script
* Add `token` option for openpath account

# 0.17.0

### ✨ Features

* Update cozy-ui from 101.1.1 to 101.2.0
* On Analysis pages, navigation with arrows should not display months without trips

### 🐛 Bug Fixes

* Month selector on the trips Analytics page

### 🔧 Tech

* Generate trip with custom date

# 0.16.0

### ✨ Features

* Add new trips measures
* Rename sections measures
* Allow triggering fetchOpenPathTripsByWebhook service from webhook

### 🐛 Bug Fixes

* Show correct geolocation tracking status if geolocation tracking has been disabled in background because of quota exceeded

# 0.15.0

* Add new DACC measure for consent

# 0.14.0

### ✨ Features

* DACC measures for experimentation

# 0.13.0

### ✨ Features

* Add an option to settings to enable DACC for CVL context

# 0.12.0

### ✨ Features

* Replace `>` by `➝` in trip title
* Add tooltip when geoloc is disabled
* Replace button style of csv export by ListItem
* Move export log button from admin to export section
* Add possibility to set a trip title manually
* Replace spinners by skeletons on Trips, BikeGoal and Analysis pages
* Display paywall when enabling geolocation if geolocation quota exceeded
* Change style of Settings page
* Add FAQ link to Settings, GPS standby & change account pages
* Add openpath service to replace konnectors
* Create coachco2-openpath account on geolocation switch
* Remove openpath konnector modal
* Do not recreate account with same device name
* Upgrade cozy-ui 95.6.0 to 100.2.0
* Upgrade cozy-client 42.2.0 to 45.1.0

### 🐛 Bug Fixes

* Now throw explicit error if  undefined `series`
* Now use default start/end place display name if not computed
* SVG animation didn't work on Safari when detecting location

### 🔧 Tech

* Update travis configuration
* Add Sentry
* Use cozy-minilog instead cozy-logger (except in services)
* Bump to node 20

# 0.11.1

## ✨ Features

* Bike goal : Change wording according to `bountyAmount`
* Bike goal : Change wording according to `sourceName`

## 🔧 Tech

* Remove useless call to `getBountyAmount`
* Remove throwing error if bountyAmount isn't set

# 0.11.0

## ✨ Features

* Move debug switch to specific category
* Change wording in onboarding
* Change color for DACC datas in emissions chart
* Add `coachco2.fake-dacc-datas.enabled` flag to fake dacc datas
* Change of onboarding wording
* Add bike goal dacc switcher for admin mode
* Use SendToDACC bike goal option to show proper info and charts
* Add end date in trip dialog
* Add last month in chart emission data computing
* Add new modes of transport
* Reverse sort order on analysis pages (mode & purpose)
* Purposes rework : remove home, school and meal, add travel and sport
* Disable ellipsis in ModeEditDialog
* The recent addition of transport modes `bicycling electric` & `scooter electric` must be taken into account for the SMP.
* On SMP edit, do not use the ellipsis to see the entire group name
* Add possiblity to link contact to start/end trip place
* Get accounts from openpath konenctor
* Generation of the SMP certificate
* Hide unused mode and purpose on Analysis page
* Coordinates-based recurrence
* Display start date instead en date in trip details (modal)
* Filter recurring loop trips on distance
* Automatic creation of trip titles
* Add tooltip on mode edit dialog title
* Adjust info block style in trip dialog
* Adjust bike goal onboarding wordings
* Simply get values from flags for sourceIdentity and sourceType
* Bike goal feature: Replaces the notion of working time by the objective to reach
* Now wait for accounts and timeseries before showing something
* Displays a specific page when there is no trip
* Show specific page on Settings if necessary
* Add "Tramway" as a mode of transport
* Move analysis SelectDates to show only if the is a content
* Bike goal : add context logo
* Remove empty date picker in Analysis pages while loading
* For certificate, use name of bikegoal user instead currentuser
* Add empty content on Bike Goal page
* Refresh look of Settings page
* Recurring UX update

## 🐛 Bug Fixes

* Style of pointToLayer on Trip Map
* Handle all modes coming from openpath
* Add missing locales for modes
* Remove in_vehicle mode from the car category
* Certificate generation does not redirect to the correct page
* Get correct title when contacts are automatically associated to trips
* Edit Location request dialogs to fit Play Store requirements
* Fix failed trip association with contact addresses
* Show specific page if no account
* The `getDaysToReach` function could be called with its `settings` parameter undefined, when it should not.
   In this case it used the flag value.
   The visible fix of this commit is the `BikeGoalChart` which could be rendered more than 100%,  and caused a graphics bug.
* Avoid flickering
* Don't display the Spinner if there is no data yet but already an account

## 🔧 Tech

* Upgrade packages
* Remove MUI packages
* Add root alias
* Use specific version of node and simplify travis.yml
* Add babel/polyfill to remove lint warning
* Change error message in save-random-trip script
* Upgrade to node ~20
* Add script option to remove relationships
* Change regex for Travis branches build

# 0.10.0

## ✨ Features

* New router to open trip on modal on a specific route on desktop

## 🐛 Bug Fixes

## 🔧 Tech

# 0.9.0

## ✨ Features

* When a trip is edited with a manual purpose, automatically detect and set purpose to similar trips
* New trips has an automatic purpose set if equivalent trip is found with a  purpose
* Allow to manually set that a trip is recurring or occasional
* Add two new routes to open trip from analysis + change back navigation button behavior

## 🐛 Bug Fixes

* Fix app crashes due to missing field in query
* Remove unused Contacts permission
* The recurring purposes service do not throw an error when display names are missing
* Display recurrence help tooltip on tap and not on hover on mobile

## 🔧 Tech

* Upgrade react-router to v6
* Update cozy-ui to 74.1.0

# 0.8.0

## ✨ Features

## 🐛 Bug Fixes

* Vertically center the trip map on mobile when opening it

# 0.7.0

## ✨ Features

* Migrate timeseries without aggregation
* Update cozy-client to get useQueryAll hook https://github.com/cozy/cozy-client/commit/590f18abbf13db372b3d3a1c517a7795957a1808
* CSV export filtered by sensor
* Display global average CO2 emissions, thanks to DACC
* Optimize aggregation query to select only required fields
* Send aggregated CO2 values to the DACC under user consent
* Add app version number and DACC alerter switch in admin mode (flag `coachco2.admin-mode`)
* Update CO2 values after manual mode edition
* Update cozy-ui to 68.9.1

## 🐛 Bug Fixes

* Locales when installing the app the first time
* Purpose locale and icon with lowercase purpose
* Remove square color in tooltip for PieChart
* Fix speed values
* Timeline is correctly sorted by date

## 🔧 Tech

* Refactor to fix https://github.com/cozy/coachCO2/issues/94 and first step to use only `timeserie` object in the application
* Memo TripItem and Boost performance when modifying a trip (purpose or mode)
* Use `timeserie` instead of `trip` to show startDate / endDate on trips list and trip info
* Use PieChart from cozy-ui
* Remove useless mui-bottom-sheet package
* Rename BottomSheetHeader to BottomSheetHeaderContent
* Upgrade React and React-dom to 17.0.2

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
