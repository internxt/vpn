import { browser } from 'wxt/browser'

const VPN_CONFIG = {
  host: import.meta.env.VITE_VPN_SERVER_ADDRESS,
  port: Number(import.meta.env.VITE_VPN_SERVER_PORT),
}

export async function updateProxySettings() {
  const proxyConfig = {
    mode: 'fixed_servers',
    rules: {
      singleProxy: {
        scheme: 'http',
        host: VPN_CONFIG.host,
        port: VPN_CONFIG.port,
      },
      bypassList: ['<local>'],
    },
  }

  browser.proxy.settings
    .set({ value: proxyConfig, scope: 'regular' })
    .then(() => {
      console.log('CONNECTED')
    })
    .catch((err) => {
      console.log('ERROR WHILE CONNECTING TO THE PROXY: ', err)
    })
}

export async function clearProxySettings() {
  const proxyConfig = {
    mode: 'system',
  }

  browser.proxy.settings
    .set({ value: proxyConfig, scope: 'regular' })
    .then(() => {
      if (browser.runtime.lastError) {
        console.error(
          'ERROR ADDING THE DEFAULT PROXY CONFIG: ',
          browser.runtime.lastError
        )
      }
    })
}
