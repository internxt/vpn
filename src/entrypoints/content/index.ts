import { browser } from 'wxt/browser'
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
        targetUrl,
      )
    }

    const isAuthPage =
      window.location.pathname.startsWith('/login') ||
      window.location.pathname.startsWith('/new')

    let retryTimer: ReturnType<typeof setTimeout> | undefined

    if (!isAuthPage) {
      requestToken()

      retryTimer = setTimeout(() => {
        if (!receivedToken) {
          console.log('No token received after 5s, retrying...')
          requestToken()
        }
      }, 5000)
    }

    window.addEventListener(
      'message',
      (event) => {
        if (!targetUrl.includes(event.origin)) return

        if (event.data?.source === LISTENER_MESSAGE_SOURCE) {
          receivedToken = true
          clearTimeout(retryTimer)

          const eventMessage = event.data.payload.message

          if (eventMessage === MESSAGES.USER_TOKEN) {
            const token = event.data.payload.token

            browser.storage.local.set({ userToken: { token, type: 'user' } })
          } else if (eventMessage === MESSAGES.USER_LOG_OUT) {
            browser.storage.local.clear().then(async () => {
              await browser.runtime.sendMessage('RESET_PROXY')
            })
          }
        }
      },
      { signal: abortController.signal },
    )
  },
})
