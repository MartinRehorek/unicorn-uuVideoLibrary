# SERVER

## BCAA Video Library - Project

Based on Express.js

---

### Unicorn Project

---

## Local Dependencies

Version of npm - `8.xx.xx`

Version of node - `16.xx.xx`

## Installation

### Local developing (localhost:4000)

1.  Rename `.env.example` to `.env`
2.  `$ npm run serve`

## Access

**Local**

- (localhost) -> Port 4000
- Credentials:
  1.  AdminUser: **adminPassword**
  2.  SimpleUser: **userPassword**

## NPM

You can check the outdate packages with: `$ npm outdate`

Update all in once: `$ npm update`

Then `$ npm i packageName@versionNumber` to install specific version : example `$ npm i browser-sync@2.1.0.`

Or `$ npm i packageName@latest` to install latest version : example `$ npm i browser-sync@latest.`

## Eslint & Prettier

- `$ npm run lint` - will be show you all errors
- `$ npm run lint:fix` - at first will be fixes errors and show you what you have to fix self
- `$ npm run format` - use Prettier for format files

### Eslint disable

- `/* eslint-disable <RULE_NAME> */`
- `/* eslint-enable <RULE_NAME> */`

  For example:

  - `/* eslint-disable camelcase */`
  - `/* eslint-enable camelcase */`

Or you can use that without **RULE_NAME**

---

# Know How

## Install Package

Before install new npm package check it per:

- `https://openbase.com`
- `https://snyk.io/advisor/`

With that step avoid **Dependency vulnerabilities** !

## YouTube API example

- `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics,status&id=ZX3qt0UWifc&key=AIzaSyB-xcCdX2f36qmiPc5_qwkYJDJIShV7Zqs`
- `https://www.googleapis.com/youtube/v3/videos?id=5hzgS9s-tE8&key=AIzaSyB-xcCdX2f36qmiPc5_qwkYJDJIShV7Zqs&part=snippet,contentDetails,statistics,status`

---

# Known Issues

## VSC disable JS/TS Language Features for VSC

`https://stackoverflow.com/questions/59860224/how-can-i-disable-initializing-js-ts-language-features-in-a-specific-project`

---

## Authors

- [Michal Durik](https://github.com/miko866)

## Copyright

&copy; Unicorn University Students
