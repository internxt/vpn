# Internxt VPN

First, clone the repository using SSH or HTTPS, e.g. `git clone https://github.com/internxt/vpn.git`.

## Before using it

- Copy the `.env.example` file and rename it to `.env`, then add the values for the variables.

## Installation

- Run `yarn` or `yarn install` to install all necessary dependencies.

## Commands

- If you want to modify the UI, you must comment out the `chrome.` functions to test it, because you will not have access to the [Chrome API](https://developer.chrome.com/docs/extensions/reference/api) (we use proxy and storage) from the `webpage`.
- If you want to test it as an extension in Chrome:
  1. Run `yarn build`.
  2. This command will create a `/dist`.
  3. Now, once the `/dist` folder is created, we have to go to `Google Chrome > chrome://extensions > developer mode > load unpacked extension > load the /dist folder` that we got in the first step.
