import { getAppUrl } from '../utils/getAppUrl'

const ALLOWED_DOMAINS = [
  'https://staging.drive.internxt.com',
  'https://drive.internxt.com',
  'http://localhost:3000',
]

export default defineContentScript({
  matches: ['*://*/*'],
  main() {
    const targetUrl = getAppUrl(import.meta.env.MODE)

    const abortController = new AbortController()
    const { signal } = abortController

    chrome.storage.local.get('token', (data) => {
      if (data.token) {
        window.postMessage(
          { source: 'drive-extension', tokenStatus: 'token-exists' },
          targetUrl
        )

        abortController.abort()
      } else {
        window.postMessage(
          { source: 'drive-extension', tokenStatus: 'token-not-found' },
          targetUrl
        )
      }
    })

    window.addEventListener(
      'message',
      (event) => {
        if (!ALLOWED_DOMAINS.includes(event.origin)) {
          console.warn('Origin not allowed:', event.origin)
          return
        }

        if (event.data?.source === 'drive-web') {
          const token = event.data.payload
          chrome.storage.local.set({ token }, () => {
            console.log('The user has been authenticated in the VPN extension')

            abortController.abort()
          })
        }
      },
      { signal }
    )
  },
})
