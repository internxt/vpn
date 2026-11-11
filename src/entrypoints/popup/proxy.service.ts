import { browser } from 'wxt/browser'

const VPN_CONFIG = {
  HOST: import.meta.env.VITE_VPN_SERVER_ADDRESS,
  PORT: Number(import.meta.env.VITE_VPN_SERVER_PORT),
}

const VPN_PROXY_ORIGIN = `http://${VPN_CONFIG.HOST}:${VPN_CONFIG.PORT}`

const IS_FIREFOX = import.meta.env.BROWSER === 'firefox'

export async function updateProxySettings() {
  if (IS_FIREFOX) {
    await browser.storage.local.set({ vpnEnabled: true })
    if (browser.webRequest.handlerBehaviorChanged) {
      await browser.webRequest.handlerBehaviorChanged()
    }
    return
  }

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

  // Chrome reuses cached proxy credentials, whose username is the previously
  // selected location. Removing cookies for the proxy origin also clears them.
  await browser.browsingData.remove(
    { origins: [VPN_PROXY_ORIGIN] },
    { cookies: true },
  )
  await browser.proxy.settings.set({ value: proxyConfig, scope: 'regular' })
}

export async function clearProxySettings() {
  if (IS_FIREFOX) {
    await browser.storage.local.set({ vpnEnabled: false })
    if (browser.webRequest.handlerBehaviorChanged) {
      await browser.webRequest.handlerBehaviorChanged()
    }
    return
  }

  const proxyConfig = {
    mode: 'system' as const,
  }

  await browser.proxy.settings.set({ value: proxyConfig, scope: 'regular' })
}
