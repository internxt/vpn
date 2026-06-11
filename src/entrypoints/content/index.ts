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

    requestToken()

    const retryTimer = setTimeout(() => {
      if (!receivedToken) {
        console.log('No token received after 5s, retrying...')
        requestToken()
      }
    }, 5000)

    browser.runtime.onMessage.addListener((message) => {
      if (message === 'REQUEST_TOKEN' && !receivedToken) {
        requestToken()
      }
    })

    window.addEventListener(
      'message',
      (event) => {
        if (!targetUrl.includes(event.origin)) return

        if (event.data?.source === LISTENER_MESSAGE_SOURCE) {
          const eventMessage = event.data.payload.message

          if (eventMessage === MESSAGES.USER_TOKEN) {
            receivedToken = true
            clearTimeout(retryTimer)
            const token = event.data.payload.token

            browser.storage.local.set({ userToken: { token, type: 'user' } })
          } else if (eventMessage === MESSAGES.USER_LOG_OUT) {
            browser.storage.local.get('userToken').then(async (result) => {
              const currentToken = result.userToken as { type: string } | undefined
              if (currentToken?.type === 'user') {
                await browser.storage.local.remove('userToken')
                await browser.runtime.sendMessage('RESET_PROXY')
              }
            })
          }
        }
      },
      { signal: abortController.signal },
    )
  },
})
