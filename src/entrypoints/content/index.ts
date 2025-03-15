import { getAppUrl } from '../utils/getUrl'

const POST_MESSAGE_SOURCE = 'drive-extension'
const LISTENER_MESSAGE_SOURCE = 'drive-web'
const MESSAGES = {
  EXISTS: 'token-exists',
  NOT_FOUND: 'token-not-found',
  USER_LOG_OUT: 'user-logged-out',
  USER_TOKEN: 'user-token',
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
        { source: POST_MESSAGE_SOURCE, tokenStatus: MESSAGES.NOT_FOUND },
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

          console.log('Token received:', event.data)
          const eventMessage = event.data.payload.message

          if (eventMessage === MESSAGES.USER_TOKEN) {
            const token = event.data.payload.token

            chrome.storage.local.set(
              {
                userToken: {
                  token,
                  type: 'user',
                },
              },
              () => {
                console.log(
                  'The user has been authenticated in the VPN extension'
                )
              }
            )
          } else if (eventMessage === MESSAGES.USER_LOG_OUT) {
            chrome.storage.local.clear(async () => {
              await chrome.runtime.sendMessage('RESET_PROXY')
              console.log('The user has been logged out from the VPN extension')
            })
          }
        }
      },
      { signal: abortController.signal }
    )
  },
})
