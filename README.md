[![Travis build status shield](https://img.shields.io/travis/cozy/coachCO2/master.svg)](https://travis-ci.org/cozy/coachCO2)
[![Github Release version shield](https://img.shields.io/github/tag/cozy/coachCO2.svg)](https://github.com/cozy/coachCO2/releases)
[![jest](https://facebook.github.io/jest/img/jest-badge.svg)](https://github.com/facebook/jest)


# Coach CO2

## What's Coach CO2?

CoachCO2 aims to raise user awareness about their carbon footprint, notably based on their location and transportation data.

### Install

Hacking the Cozy Coach CO2 app requires you to [setup a dev environment][setup].

You can then clone the app repository and install dependencies:

```sh
$ git clone https://github.com/cozy/coachCO2.git
$ cd coachco2
$ yarn install
```

:pushpin: If you use a node environment wrapper like [nvm] or [ndenv], don't forget to set your local node version before doing a `yarn install`.

Cozy's apps use a standard set of _npm scripts_ to run common tasks, like watch, lint, test, build…

### Fixtures

You can import fixtures to quickly deal with data.

⚠️ You need to run the `timeseriesWithoutAggregateMigration` services after any insertion to make your trips usable in the app. See [below](#Aggregation_service) for more details.

#### Add multiple trips

Finally, run the following command to import fixtures:

```sh
$ yarn fixtures
```

Alternatively, if you do not wish to work on the default `http://cozy.localhost:8080` URL, please use the following commands:

```bash
yarn ACH import accounts/tracemob.json --url http://your_custom_url:port
yarn ACH script timeseries/importGeojson --url http://your_custom_url:port
```

#### Add single trips
Then you can generate a random trip by running (use `--help` for more information)

```
yarn scripts:addTrip
```

Or if you don't use the defaut `http://cozy.localhost:8080`:

```bash
yarn script:addTrip --url http://your_custom_url:port
```

#### Add single account
This script allows you to add a tracemob or openpath type account

For openpath account you can specify a custom token. Specify a token set the `--source-account` option to `openpath`. (use `--help` for more information)

```
yarn scripts:addAccount [-l, --login] <login>
```

#### Drop single account
This script allows you to delete an account (tracemob or openpath) as well as the associated timeseries.

In the case where the account is the one selected by default in the app, if another account exists then we update with the first other account found. (use `--help` for more information)

```
yarn scripts:dropAccount --source-account <id>
```

### Aggregation service

You can run a migration service to add aggregation data on your timeseries. This is necessary because the trips documents can be huge and negatively impact the app performances. Therefore, we rely on an aggregated trip view on the app side. If the aggregation is missing, the trip won't be displayed.

⚠️ Make sure to update your development URL in `./konnector-dev-config.json` in the field `"COZY_URL"` if you do not wish to use the default URL `http://cozy.localhost:8080`.

⚠️ You need to build the application before using services, to generate them.

```sh
$ yarn build
$ yarn service:timeseriesWithoutAggregateMigration
```

⚠️ If the service is not working due to an invalid JWT token, please delete it from your filesystem and restart the service, it was probably created for another instance that the one you're querying for (the token path will be printed in the error message).
You will then be prompted to login again, possibly from a `localhost:3333` server if your cozy-url is not ending with `localhost` or `tools`. It shouldn't be an issue unless you have a tight management of port forwarding in place.

### Feature flags availables

- `coachco2.admin-mode`: activate some hidden functions
- `coachco2.fake-dacc-datas.enabled`: use same data for DACC in CO2 emissions chart
- `coachco2.dacc-dev_v2`: to use dev version of DACC
- `coachco2.bikegoal.enabled`: to activate the "bike goal" feature. To work properly `coachco2.bikegoal.settings` should be set too.
- `coachco2.bikegoal.settings`: to change settings by context. It's an object:
  - **bountyAmount**: `<number>` - amount of the bonus granted
  - **daysToReach**: `<number>` - number of days to be reached to benefit from the bonus
  - **sourceType**: `<string>` - type of source entity issuing the bonus.
  - **sourceName**: `<string>` - name of the source entity
  - **sourceOffer**: `<string>` - offer proposed by the source


### Add a mode of transport
- To [constants.js](./src/constants.js) file:
  - Export constant mode:
    `export const <modeName>_MODE = '<modeName>'`
  - Export CO2 constants, given in kg per km:
    `export const <modeName>_CO2_KG_PER_KM = <number>`
- To [helpers.js](./src/components/helpers.js) file:
  - Add new mode to `modes` array
  - Add case to `pickModeIcon` function (Importing the icon from cozy-ui required)
  - Add case to `modeToColor` function (used on Analysis pages)
  - Add case to `getAverageCO2PerKmByMode` function
  - Add case to `modeToCategory` function
- To [metrics.js](./src/lib/metrics.js) file:
  - Add case to `computeCO2Section` function
- And finally, add the translations ([fr](./src/locales/fr.json), [en](./src/locales/en.json))

### Run it inside a Cozy using Docker

You can run your application inside a Cozy thanks to the [cozy-stack docker image][cozy-stack-docker]:

```sh
# in a terminal, run your app in watch mode with a docker running Cozy
$ cd coachco2
$ yarn start
```

```sh
# in an other terminal, run the docker image
$ cd coachco2
$ yarn stack:docker:dev
```

After the build and the docker image launched, your app is now available at http://coachco2.cozy.tools:8080.

Note: By default, HMR (Hot Module Replacement) is enabled on your front application. To have it working, we have disabled our CSP (Content Security Policy) when running `yarn stack:docker:dev`. This is not the configuration we'll have in a production environnement. To test our app in real conditions, build your application by running `yarn build` and launch the docker image with the `yarn stack:docker:prod` command.

### Living on the edge

[Cozy-ui] is our frontend stack library that provides common styles and components accross the whole Cozy's apps. You can use it for you own application to follow the official Cozy's guidelines and styles. If you need to develop / hack cozy-ui, it's sometimes more useful to develop on it through another app. You can do it by cloning cozy-ui locally and link it to yarn local index:

```sh
git clone https://github.com/cozy/cozy-ui.git
cd cozy-ui
yarn install
yarn link
```

then go back to your app project and replace the distributed cozy-ui module with the linked one:

```sh
cd cozy-drive
yarn link cozy-ui
```

[Cozy-client-js] is our API library that provides an unified API on top of the cozy-stack. If you need to develop / hack cozy-client-js in parallel of your application, you can use the same trick that we used with [cozy-ui]: yarn linking.


### Tests

Tests are run by [jest] under the hood. You can easily run the tests suite with:

```sh
$ cd coachco2
$ yarn test
```

:pushpin: Don't forget to update / create new tests when you contribute to code to keep the app the consistent.

### Open a Pull-Request

If you want to work on Coach CO2 and submit code modifications, feel free to open pull-requests! See the [contributing guide][contribute] for more information about how to properly open pull-requests.

## Models

The Cozy datastore stores documents, which can be seen as JSON objects. A `doctype` is simply a declaration of the fields in a given JSON object, to store similar objects in an homogeneous fashion.

Cozy ships a [built-in list of `doctypes`][doctypes] for representation of most of the common documents.

### Timeseries models and nomenclature

This application use [geoJSON][geojsonWikipedia] object inside [timeseries][timeseries] from `io.cozy.timeseries.geojson` doctype.

The doc returned from `io.cozy.timeseries.geojson` is a `timeserie`. The `series` prop (aka `doc.series`) stores `geoJSON` objects, called `trips`. Each `trips` may have `sections` stores in `features` prop (aka `doc.series[x].features`).

```jsonc
{ // timeserie
  "series": [ // only one serie here, including GeoJSON content
    {
      // trip description
      "type": "FeatureCollection",
      "properties": {
        "start_fmt_time": "2022-04-02T16:00:13",
        "end_fmt_time": "2022-04-02T16:13:09",
        "duration": 776, // duration in seconds
        "distance": 3245, // distance in meters
        "start_loc": { // starting point coordinates
          "type": "Point",
          "coordinates": [
            -0.8119085, // longitude
            46.4536633 // latitude
          ]
        },
        "end_loc": { // ending point coordinates
          "type": "Point",
          "coordinates": [
            -0.8119085, // longitude
            46.4536633 // latitude
          ]
        },
        "start_place": {
          "$oid": "6248ec5d5d25e718233a5099"
        },
        "end_place": {
          "$oid": "6248ec5e5d25e718233a509a"
        },
        "confidence_threshold": 0.65,
        "manual_purpose": "ENTERTAINMENT", // Trip purpose set by the user
        "automatic_purpose": "ENTERTAINMENT" // Trip purpose automatically detected
      },
      "features": [
        { // starting place
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [-0.8119085, 46.4536633] // longitude, latitude
          },
          "id": "6248ec5d5d25e718264a4099",
          "properties": {
            "feature_type": "start_place",
            "display_name": "Avenue Jean Guiton, La Rochelle",
            "enter_fmt_time": "2022-04-02T14:56:05", // Arrival at the starting place
            "exit_fmt_time": "2022-04-02T16:00:13", // Departure from the starting place
            "duration": 3848.2966425418854, // Duration spent at the starting place
          }
        },
        { // ending place
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [-0.7519085, 46.4536633] // longitude, latitude
          },
          "id": "6248ec5e5d25e718264a409a",
          "properties": {
            "feature_type": "end_place",
            "display_name": "Rue Ampère, La Rochelle",
            "enter_fmt_time": "2022-04-02T16:13:09", // Arrival at the ending place
          }
        },
        { // section description
          "type": "FeatureCollection",
          "features": [ // only one feature here
            {
              "type": "Feature",
              "geometry": {
                "type": "LineString",
                "coordinates": [...] // List of section coordinates
              },
              "id": "6248ec535d25e718264a4073",
              "properties": {
                "times": [...], // List of times, in seconds
                "timestamps": [...], // List of timestamps, in ms
                "start_fmt_time": "2022-04-02T16:00:13",
                "end_fmt_time": "2022-04-02T16:13:09",
                "duration": 776, // Section duration, in seconds
                "speeds": [...], // List of speeds, in m/s
                "distances": [...], // List of distances, in meters
                "distance": 4948, // Section's total distance, in meters
                "sensed_mode": "PredictedModeTypes.CAR", // Detected mode in mobile
                "manual_mode": "BIKE", // Manual mode set by the user
                "feature_type": "section",
                "source": "SmoothedHighConfidenceMotion"
              }
            }
          ]
        }
      ],
    }
  ]
}
```

### Aggregation

Every timeserie is automatically aggregated by a service, to sum up the `series` content into an `aggregation` object, saved directly inside the `io.cozy.timeseries.geojson` document. Here is an example:

```json
{
  "aggregation": {
    "modes": [
      "WALKING"
    ],
    "purpose": "ENTERTAINMENT",
    "sections": [
      {
        "CO2": 0,
        "avgSpeed": 5.204285178716263,
        "calories": 22.83998061653227,
        "distance": 377.40909178940984,
        "duration": 210.9319999217987,
        "id": "600772889801285fa1f3a7b6",
        "mode": "WALKING",
        "startDate": "2021-01-19T16:54:26.068Z",
        "endDate": "2021-01-19T16:57:57.000Z"
      }
    ],
    "startPlaceDisplayName": "Avenue Jean Guiton, La Rochelle",
    "endPlaceDisplayName": "Rue Ampère, La Rochelle",
    "coordinates": {
      "startPoint": {
        "lon": -0.8119085,
        "lat": 46.4536633
      },
      "endPoint": {
        "lon": -0.7519085,
        "lat": 46.4536633
      }
    },
    "totalCO2": 0,
    "totalCalories": 22.83998061653227,
    "totalDistance": 377.40909178940984,
    "totalDuration": 210.9319999217987
  }
}

```

## DACC

This app uses the [DACC](https://github.com/cozy/DACC) to send and received anonymized contributions.
This is used to compare average CO2 emissions: if the user gives consent, her monthly CO2 emissions are sent to the DACC.
Then, she can compare herself with the average emissions of all the participating users.
All data sent to the DACC is anonymized, and only aggregated values under a certain threshold can be queried.

### Develop with the DACC

To develop locally with the DACC, you first need to get an access token to the dev server. Then, you need to:

- Set the flag `coachco2.dacc-dev_v2`. You can do it by running `cozy-stack features flags '{"coachco2.dacc-dev_v2": true}'`.
- Add a secret document containing the DACC token:
  - Create a database `secrets/io-cozy-remote-secrets` if it does not exist yet. You may need to replace the `/` with `%2F` depending on your client.
  - Add the following document:
  ```
  {
    "_id": "cc.cozycloud.dacc.dev_v2",
    "token": "<dacc_token>"
  }
  ```

Now, thanks to this, you should be able to use the DACC's remote-doctype!


## Community

### Localization

Localization and translations are handled by [Transifex][tx], which is used by all Cozy's apps.

As a _translator_, you can login to [Transifex][tx-signin] (using your Github account) and claim an access to the [app repository][tx-app]. Transifex will then create pull request on the repository, and the locales are merged after validating the pull request.

As a _developer_, you just have to modify json in `/src/locales`. New locales will be automatically added to Transifex. If you need to pull or push manually locales, you can use [Transifex CLI](tx-cli). If you were using a [transifex-client](tx-client), you must move to [Transifex CLI](tx-cli) to be compatible with the v3 API.


### What's Cozy?

<div align="center">
  <a href="https://cozy.io">
    <img src="https://cdn.rawgit.com/cozy/cozy-site/master/src/images/cozy-logo-name-horizontal-blue.svg" alt="cozy" height="48" />
  </a>
 </div>
 </br>

[Cozy] is a platform that brings all your web services in the same private space.  With it, your webapps and your devices can share data easily, providing you with a new experience. You can install Cozy on your own hardware where no one's tracking you.

### Maintainer

The lead maintainer for Coach CO2 is [cozy](https://github.com/cozy), send him/her a :beers: to say hello!


### Get in touch

You can reach the Cozy Community by:

- Chatting with us on IRC [#cozycloud on Libera.Chat][libera]
- Posting on our [Forum][forum]
- Posting issues on the [Github repos][github]
- Say Hi! on [Twitter][twitter]


## License

Coach CO2 is developed by cozy and distributed under the [AGPL v3 license][agpl-3.0].



[cozy]: https://cozy.io "Cozy Cloud"
[setup]: https://dev.cozy.io/#set-up-the-development-environment "Cozy dev docs: Set up the Development Environment"
[yarn]: https://yarnpkg.com/
[yarn-install]: https://yarnpkg.com/en/docs/install
[cozy-ui]: https://github.com/cozy/cozy-ui
[cozy-client-js]: https://github.com/cozy/cozy-client-js/
[cozy-stack-docker]: https://github.com/cozy/cozy-stack/blob/master/docs/client-app-dev.md#with-docker
[doctypes]: https://cozy.github.io/cozy-doctypes/
[bill-doctype]: https://github.com/cozy/cozy-konnector-libs/blob/master/models/bill.js
[konnector-doctype]: https://github.com/cozy/cozy-konnector-libs/blob/master/models/base_model.js
[konnectors]: https://github.com/cozy/cozy-konnector-libs
[agpl-3.0]: https://www.gnu.org/licenses/agpl-3.0.html
[contribute]: CONTRIBUTING.md
[tx]: https://www.transifex.com/cozy/
[tx-signin]: https://www.transifex.com/signin/
[tx-app]: https://www.transifex.com/cozy/<SLUG_TX>/dashboard/
[tx-client]: http://docs.transifex.com/client/
[libera]: https://web.libera.chat/#cozycloud
[forum]: https://forum.cozy.io/
[github]: https://github.com/cozy/
[twitter]: https://twitter.com/cozycloud
[nvm]: https://github.com/creationix/nvm
[ndenv]: https://github.com/riywo/ndenv
[jest]: https://facebook.github.io/jest/
[geojsonWikipedia]: https://en.wikipedia.org/wiki/GeoJSON
[timeseries]: https://docs.cozy.io/cozy-doctypes/io.cozy.timeseries.html
