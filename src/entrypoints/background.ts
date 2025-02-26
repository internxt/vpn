import { WebRequest } from 'wxt/browser'

export default defineBackground(() => {
  const IP_API_URL = import.meta.env.VITE_IP_API_URL

  chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
      chrome.tabs.create({ url: 'https://internxt.com/vpn' })
    }
  })

  chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
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
          // NO OP
        })
    }
    return true
  })

  // background.ts

  const localCache = {
    token: null as string | null,
    connection: null as string | null,
  }

  async function initializeLocalCache() {
    const { token, connection } = await chrome.storage.local.get([
      'token',
      'connection',
    ])
    localCache.token = token ?? null
    localCache.connection = connection ?? null
  }

  initializeLocalCache()

  // Listener de cambios en el storage
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local') {
      if (changes.token) {
        localCache.token = changes.token.newValue ?? null
      }
      if (changes.connection) {
        localCache.connection = changes.connection.newValue ?? null
      }
    }
  })

  browser.webRequest.onAuthRequired.addListener(
    function (details: WebRequest.OnAuthRequiredDetailsType) {
      if (details.isProxy) {
        console.log({ localCache })
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
    ['blocking']
  )

  browser.webRequest.onErrorOccurred.addListener(
    (error) => {
      console.log('[AN ERROR OCURRED]:', error)
    },
    { urls: ['<all_urls>'] }
  )
})
