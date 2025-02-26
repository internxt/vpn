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
    const targetUrl = getAppUrl('development')
    console.log('TargetUrl:', targetUrl, 'Origin:', window.location.origin)

    // Solo continuamos si la URL de la página matchea con la que esperamos
    if (!targetUrl.includes(window.location.origin)) {
      return
    }

    let receivedToken = false
    const abortController = new AbortController()

    // Función que envía el "request" de token
    const requestToken = () => {
      window.postMessage(
        { source: POST_MESSAGE_SOURCE, tokenStatus: TOKEN_STATUS.NOT_FOUND },
        targetUrl
      )
    }

    // 1. Enviamos el primer request
    requestToken()

    // 2. Preparamos un retry a los 5s si no llega el token
    const retryTimer = setTimeout(() => {
      if (!receivedToken) {
        console.log('No token received after 5s, retrying...')
        requestToken()
      }
    }, 5000)

    // 3. Escuchamos la respuesta
    window.addEventListener(
      'message',
      (event) => {
        // Validamos origen
        if (!targetUrl.includes(event.origin)) return

        // Si la web nos manda de vuelta el token
        if (event.data?.source === LISTENER_MESSAGE_SOURCE) {
          receivedToken = true
          clearTimeout(retryTimer) // Cancelamos el retry (o retiros futuros)

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
