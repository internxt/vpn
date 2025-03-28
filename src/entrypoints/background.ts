import { WebRequest } from 'wxt/browser'
import { handleUserToken } from './utils/handleUserToken'
import { clearProxySettings } from './popup/proxy.service'

const FOUR_DAYS_IN_MS = 4 * 24 * 60 * 60 * 1000
let interval: NodeJS.Timeout | null = null

function startInterval() {
  if (interval) clearInterval(interval)
  interval = setInterval(() => {
    console.log('Refresh token')
    handleUserToken()
  }, FOUR_DAYS_IN_MS)
}

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
  }

  async function initializeLocalCache() {
    const { userToken, connection } = await chrome.storage.local.get([
      'userToken',
      'connection',
    ])
    console.log('INITIAL LOCAL STORAGE: ', userToken)
    localCache.token = userToken?.token ?? null
    localCache.connection = connection ?? null
  }
  startInterval()
  initializeLocalCache()

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local') {
      if (changes.userToken?.newValue) {
        localCache.token = changes.userToken.newValue?.token ?? null
        startInterval()
      }
      if (changes.connection?.newValue) {
        localCache.connection = changes.connection.newValue ?? null
      }
    }
  })

  browser.webRequest.onAuthRequired.addListener(
    function (details: WebRequest.OnAuthRequiredDetailsType) {
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
    ['blocking']
  )

  browser.webRequest.onErrorOccurred.addListener(
    (error) => {
      console.log('[AN ERROR OCURRED]:', error)
    },
    { urls: ['<all_urls>'] }
  )
})
