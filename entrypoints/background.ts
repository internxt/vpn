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

  browser.webRequest.onBeforeSendHeaders.addListener(
    function (details: WebRequest.OnBeforeSendHeadersDetailsType) {
      const headers = details.requestHeaders || []
      chrome.storage.local.get('token')

      headers.push({ name: 'Authorization', value: 'Bearer <your-token>' })
      headers.push({
        name: 'internxt-connection',
        value: '<your-new-connection>',
      })

      return { requestHeaders: headers }
    },
    {
      urls: ['<all_urls>'],
    },
    ['blocking', 'requestHeaders']
  )

  browser.webRequest.onErrorOccurred.addListener(
    (error) => {
      console.log('[AN ERROR OCURRED]:', error)
    },
    { urls: ['<all_urls>'] }
  )
})
