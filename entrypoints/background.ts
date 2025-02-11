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

  browser.webRequest.onAuthRequired.addListener(
    function (details: WebRequest.OnAuthRequiredDetailsType) {
      if (details.isProxy) {
        return {
          authCredentials: {
            username: import.meta.env.VITE_VPN_USERNAME,
            password: import.meta.env.VITE_VPN_PASSWORD,
          },
        }
      }
    },
    {
      urls: ['<all_urls>'],
    },
    ['blocking']
  )

  browser.webRequest.onErrorOccurred.addListener(
    (error) => {
      console.log('[AN ERROR OCURRED]:', error)
    },
    { urls: ['<all_urls>'] }
  )
})
