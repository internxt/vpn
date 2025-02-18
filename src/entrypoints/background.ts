import { browser, WebRequest } from 'wxt/browser'

export default defineBackground(() => {
  const IP_API_URL = import.meta.env.VITE_IP_API_URL

  chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
      chrome.tabs.create({ url: 'https://internxt.com/vpn' })
    }
  })

  function setDynamicRules(tokenValue: string, internxtConnection: string) {
    chrome.declarativeNetRequest.updateDynamicRules(
      {
        addRules: [
          {
            id: 1001,
            priority: 1,
            action: {
              type: 'modifyHeaders',
              requestHeaders: [
                {
                  header: 'Authorization',
                  operation: 'set',
                  value: tokenValue,
                },
                {
                  header: 'internxt-connection',
                  operation: 'set',
                  value: internxtConnection,
                },
              ],
            },
            condition: {
              urlFilter: '*',
              resourceTypes: ['main_frame', 'sub_frame', 'xmlhttprequest'],
            },
          },
        ],
        removeRuleIds: [1001],
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error(
            'Error actualizando reglas dinámicas:',
            chrome.runtime.lastError
          )
        } else {
          console.log('Reglas dinámicas actualizadas correctamente')
        }
      }
    )
  }

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
    setDynamicRules('TOKEN', 'connection')

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
