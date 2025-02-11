import { getAppUrl } from '../utils/getAppUrl'

const POST_MESSAGE_SOURCE = 'drive-extension'
const LISTENER_MESSAGE_SOURCE = 'drive-web'
const TOKEN_STATUS = {
  EXISTS: 'token-exists',
  NOT_FOUND: 'token-not-found',
}

export default defineContentScript({
  matches: ['*://*/*'],
  main() {
    const targetUrl = getAppUrl(import.meta.env.MODE)

    const abortController = new AbortController()
    const { signal } = abortController

    chrome.storage.local.get('token', (data) => {
      if (data.token) {
        window.postMessage(
          { source: POST_MESSAGE_SOURCE, tokenStatus: TOKEN_STATUS.EXISTS },
          targetUrl
        )

        abortController.abort()
      } else {
        window.postMessage(
          { source: POST_MESSAGE_SOURCE, tokenStatus: TOKEN_STATUS.NOT_FOUND },
          targetUrl
        )
      }
    })

    window.addEventListener(
      'message',
      (event) => {
        if (!targetUrl.includes(event.origin)) {
          console.warn('Origin not allowed:', event.origin)
          return
        }

        if (event.data?.source === LISTENER_MESSAGE_SOURCE) {
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
