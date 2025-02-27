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

    if (!targetUrl.includes(window.location.origin)) {
      return
    }

    let receivedToken = false
    const abortController = new AbortController()

    const requestToken = () => {
      window.postMessage(
        { source: POST_MESSAGE_SOURCE, tokenStatus: TOKEN_STATUS.NOT_FOUND },
        targetUrl
      )
    }

    requestToken()

    const retryTimer = setTimeout(() => {
      if (!receivedToken) {
        console.log('No token received after 5s, retrying...')
        requestToken()
      }
    }, 5000)

    window.addEventListener(
      'message',
      (event) => {
        if (!targetUrl.includes(event.origin)) return

        if (event.data?.source === LISTENER_MESSAGE_SOURCE) {
          receivedToken = true
          clearTimeout(retryTimer)

          const token = event.data.payload
          chrome.storage.local.set({ token, authenticated: true }, () => {
            console.log('The user has been authenticated in the VPN extension')
            abortController.abort()
          })
        }
      },
      { signal: abortController.signal }
    )
  },
})
