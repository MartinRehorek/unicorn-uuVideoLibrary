# CLIENT

## BCAA Video Library - Project

Based on React.js

---

### Unicorn Project

#### Setup frontend config

Before start please create .env file and set following variable (for dev set = localhost:4000):

`REACT_APP_SERVER_API_URL='urltobackendapi'`

---

## Local Dependencies

Version of npm - `8.xx.xx`

Version of node - `16.xx.xx`

## Installation

### Local developing (localhost:3000)

1.  `$ npm run start`

## Access

**Local**

- (localhost) -> Port 3000

## Localhost iOS - Safari debugging \_Only for MacOS

For local Safari local development we are using _ngrog_

1. Go to `https://dashboard.ngrok.com/signup` and sing up or create account.
2. Download the desktop client.
3. ./ngrok authtoken <YOUR_AUTH_TOKEN>
4. Start next server `$ npm run dev`
5. `$ ./ngrok http 3000`
6. The URL provided under forwarding is how we'll access it. - Copy it to Safari and happy debugging.

## NPM

You can check the outdate packages with: `$ npm outdate`

Update all in once: `$ npm update`

Then `$ npm i packageName@versionNumber` to install specific version : example `$ npm i browser-sync@2.1.0.`

Or `$ npm i packageName@latest` to install latest version : example `$ npm i browser-sync@latest.`

---

# Know How

## Favicon generator

`https://realfavicongenerator.net/`

## Install Package

Before install new npm package check it per:

- `https://openbase.com`
- `https://snyk.io/advisor/`

With that step avoid **Dependency vulnerabilities** !

---

# Known Issues

## VSC disable JS/TS Language Features for VSC

`https://stackoverflow.com/questions/59860224/how-can-i-disable-initializing-js-ts-language-features-in-a-specific-project`

---

## Authors

- [Michal Durik](https://github.com/miko866)

## Copyright

&copy; Unicorn University Students
