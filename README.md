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

You can import fixtures to quickly deal with datas

```sh
$ yarn fixtures
```

### Services

You can run a migration service to add aggregation data on your timeseries.

```sh
$ yarn service:timeseriesWithoutAggregateMigration
```

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
            -0.8119085,
            46.4536633
          ]
        },
        "end_loc": { // ending point coordinates
          "type": "Point",
          "coordinates": [
            -0.8119085,
            46.4536633
          ]
        },
        "start_place": {
          "$oid": "6248ec5d5d25e718233a5099"
        },
        "end_place": {
          "$oid": "6248ec5e5d25e718233a509a"
        },
        "confidence_threshold": 0.65,
        "manual_purpose": "ENTERTAINMENT" // Trip purpose set by the user
      },
      "features": [
        { // starting place
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [-0.8119085, 46.4536633]
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
            "coordinates": [-0.7519085, 46.4536633]
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

## DACC

This app uses the [DACC](https://github.com/cozy/DACC) to send and received anonymized contributions. 
This is used to compare average CO2 emissions: if the user gives consent, her monthly CO2 emissions are sent to the DACC.
Then, she can compare herself with the average emissions of all the participating users.
All data sent to the DACC is anonymized, and only aggregated values under a certain threshold can be queried.

## Community

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

- Chatting with us on IRC [#cozycloud on Freenode][freenode]
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
[freenode]: http://webchat.freenode.net/?randomnick=1&channels=%23cozycloud&uio=d4
[forum]: https://forum.cozy.io/
[github]: https://github.com/cozy/
[twitter]: https://twitter.com/cozycloud
[nvm]: https://github.com/creationix/nvm
[ndenv]: https://github.com/riywo/ndenv
[jest]: https://facebook.github.io/jest/
[geojsonWikipedia]: https://en.wikipedia.org/wiki/GeoJSON
[timeseries]: https://docs.cozy.io/cozy-doctypes/io.cozy.timeseries.html
