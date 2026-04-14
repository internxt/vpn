import { browser } from 'wxt/browser'

const VPN_CONFIG = {
  HOST: import.meta.env.VITE_VPN_SERVER_ADDRESS,
  PORT: Number(import.meta.env.VITE_VPN_SERVER_PORT),
}

async function clearProxyCache() {
  const options: Record<string, any> = {}
  const rootDomain = VPN_CONFIG.HOST
  options.origins = []
  options.origins.push('http://' + rootDomain)
  options.origins.push('https://' + rootDomain)

  const types = { cookies: true }
  browser.browsingData.remove(options, types).then(() => {
    console.log('PROXY CACHE REMOVED')
  })
}

export async function updateProxySettings() {
  const proxyConfig = {
    mode: 'fixed_servers' as const,
    rules: {
      singleProxy: {
        scheme: 'http' as const,
        host: VPN_CONFIG.HOST,
        port: VPN_CONFIG.PORT,
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
    mode: 'system' as const,
  }

  browser.proxy.settings
    .set({ value: proxyConfig, scope: 'regular' })
    .then(() => {
      if (browser.runtime.lastError) {
        console.error(
          'ERROR ADDING THE DEFAULT PROXY CONFIG: ',
          browser.runtime.lastError,
        )
      }
      clearProxyCache()
    })
}
