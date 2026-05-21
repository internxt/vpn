import { browser } from 'wxt/browser'
import { handleUserToken } from './utils/handleUserToken'
import { clearProxySettings, updateProxySettings } from './popup/proxy.service'

const FOUR_DAYS_IN_MS = 4 * 24 * 60 * 60 * 1000
let interval: NodeJS.Timeout | null = null

function startInterval() {
  if (interval) clearInterval(interval)
  interval = setInterval(() => {
    handleUserToken()
  }, FOUR_DAYS_IN_MS)
}

export default defineBackground(() => {
  const IP_API_URL = import.meta.env.VITE_IP_API_URL

  browser.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
      browser.tabs.create({ url: 'https://internxt.com/vpn' })
    }
  })

  browser.runtime.onMessage.addListener((message, _, sendResponse) => {
    if (message === 'GET_DATA') {
      fetch(`${IP_API_URL}/json`, {
        method: 'GET',
      })
        .then((data) => data.json())
        .then((items) => {
          const { ip, city, region, country } = items
          const locationText = `${city}, ${region}, ${country}`
          sendResponse({
            location: locationText,
            ip,
          })
        })
        .catch(() => {
          sendResponse(null)
        })
    } else if (message === 'SET_PROXY') {
      updateProxySettings()
        .then(() => {
          sendResponse({})
        })
        .catch(() => {
          sendResponse({})
        })
    } else if (message === 'RESET_PROXY') {
      clearProxySettings()
        .then(() => {
          console.log('THE PROXY SETTINGS HAS BEEN CLEARED')
        })
        .catch((error) => {
          console.error(`ERROR WHILE CLEARING PROXY SETTINGS: ${error}`)
        })
      sendResponse({})
    }
    return true
  })

  const localCache = {
    token: null as string | null,
    connection: null as string | null,
    vpnEnabled: false as boolean,
  }

  async function initializeLocalCache() {
    const result = await browser.storage.local.get(['userToken', 'connection', 'vpnEnabled'])
    const userToken = result.userToken as { token: string } | undefined
    const connection = result.connection as string | undefined
    console.log('INITIAL LOCAL STORAGE: ', userToken)
    localCache.token = userToken?.token ?? null
    localCache.connection = connection ?? null
    localCache.vpnEnabled = (result.vpnEnabled as boolean) ?? false
  }

  startInterval()
  initializeLocalCache()

  browser.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local') {
      if (changes.userToken?.newValue) {
        localCache.token = (changes.userToken.newValue as { token: string })?.token ?? null
        startInterval()
      }
      if (changes.connection?.newValue) {
        localCache.connection = (changes.connection.newValue as string) ?? null
      }
      if ('vpnEnabled' in changes) {
        localCache.vpnEnabled = (changes.vpnEnabled.newValue as boolean) ?? false
      }
    }
  })

  if (import.meta.env.BROWSER === 'firefox') {
    const VPN_HOST = import.meta.env.VITE_VPN_SERVER_ADDRESS
    const VPN_PORT = Number(import.meta.env.VITE_VPN_SERVER_PORT)
    ;(browser as any).proxy.onRequest.addListener(
      (details: any) => {
        if (details.tabId === -1 || details.originUrl?.startsWith('moz-extension://')) return { type: 'direct' }
        if (!localCache.vpnEnabled) return { type: 'direct' }
        return { type: 'http', host: VPN_HOST, port: VPN_PORT, username: localCache.connection ?? 'FR', password: localCache.token ?? '' }
      },
      { urls: ['<all_urls>'] },
    )

    browser.webRequest.onAuthRequired.addListener(
      function (details) {
        if (!details.isProxy) return {}
        return { authCredentials: { username: localCache.connection ?? 'FR', password: localCache.token ?? '' } }
      },
      { urls: ['<all_urls>'] },
      ['blocking'],
    )
  } else {
    browser.webRequest.onAuthRequired.addListener(
      function (details) {
        if (details.isProxy) {
          return {
            authCredentials: {
              username: localCache.connection ?? 'FR',
              password: localCache.token ?? '',
            },
          }
        }
        return {}
      },
      { urls: ['<all_urls>'] },
      ['blocking'],
    )
  }
})
