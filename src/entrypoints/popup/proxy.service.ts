import { browser } from 'wxt/browser'

const VPN_CONFIG = {
  HOST: import.meta.env.VITE_VPN_SERVER_ADDRESS,
  PORT: Number(import.meta.env.VITE_VPN_SERVER_PORT),
}

const IS_FIREFOX = import.meta.env.BROWSER === 'firefox'

async function clearProxyCache() {
  browser.browsingData.remove({}, { cookies: true })
}

async function reloadAllTabsBypassingCache() {
  const tabs = await browser.tabs.query({})
  await Promise.all(
    tabs
      .filter((tab) => tab.id !== undefined && !tab.url?.startsWith('about:'))
      .map((tab) => browser.tabs.reload(tab.id!, { bypassCache: true })),
  )
}

export async function updateProxySettings() {
  if (IS_FIREFOX) {
    await browser.storage.local.set({ vpnEnabled: true })
    if (browser.webRequest.handlerBehaviorChanged) {
      await browser.webRequest.handlerBehaviorChanged()
    }
    await reloadAllTabsBypassingCache()
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

  browser.proxy.settings.set({ value: proxyConfig, scope: 'regular' })
  await browser.tabs.reload()
}

export async function clearProxySettings() {
  if (IS_FIREFOX) {
    await browser.storage.local.set({ vpnEnabled: false })
    clearProxyCache()
    if (browser.webRequest.handlerBehaviorChanged) {
      await browser.webRequest.handlerBehaviorChanged()
    }
    await reloadAllTabsBypassingCache()
    return
  }

  const proxyConfig = {
    mode: 'system' as const,
  }

  browser.proxy.settings
    .set({ value: proxyConfig, scope: 'regular' })
    .then(() => {
      clearProxyCache()
    })
}
