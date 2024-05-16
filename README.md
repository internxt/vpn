# Internxt VPN

First, clone the repository using SSH or HTTPS, e.g. `git clone https://github.com/internxt/vpn.git`.

### 🛠️ Tools

- [Typescript](https://www.typescriptlang.org/).

- [WXT](https://wxt.dev/): It is a framework for web extensions. We use this framework mainly because it allows us to develop the extension with React+Typescrip and to facilitate the packaging and deployment of the extension for all websites (mainly Firefox, Chrome and Safari).

- [React](https://react.dev/).

- [TailwindCSS](https://tailwindcss.com/).

## Before using it

### Configuring the project

- Copy the `.env.example` file and rename it to `.env`, then add the values for the variables.

## Installation

- Execute `yarn` or `yarn install` to install all necessary dependencies.

## Commands

### 👨🏽‍💻 Dev mode

1. Execute `yarn dev` for development mode in your terminal.
2. This command will compile the application > open Google Chrome (it is the default browser for development, if you want to use Firefox for example, run `yarn dev:firefox`) > add the extension automatically.
3. Open the extensions dropdown and the VPN is ready to use.

WXT has hot reload, so you will be able to see the changes in real time.

### 🧪 Testing the VPN simulating production

1. Execute `yarn build` in your terminal.
2. This command will compile the extension in `.output/chrome-mv3`.
3. Now, go to `Google Chrome > chrome://extensions > activate the developer mode (right up corner) > load unpacked extension > load the /chrome-mv3 folder`.

And that's it, you can now use the VPN as if it were a published one.

### 🗂️ Compressing the extension to publish

1. Execute `yarn zip` (or `yarn zip:firefox` in case you want to publish the VPN in Firefox) in your terminal.
2. This command will generate a ZIP in the `.output` folder. This is the ZIP you have to use to publish the VPN.

You can follow [these steps](https://developer.chrome.com/docs/webstore/publish) if you are not familiar with how to publish Extensions in Chrome.
