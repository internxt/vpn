export default defineContentScript({
  matches: ['*://*/*'],
  main(ctx) {
    const allowedOrigins = [
      'https://staging.drive.internxt.com',
      'https://drive.internxt.com',
      'http://localhost:3000',
      'http://localhost:3001',
    ]
    const abortController = new AbortController()

    chrome.storage.local.get('token', (data) => {
      if (data.token) {
        window.postMessage(
          { source: 'drive-extension', tokenStatus: 'token-exists' },
          allowedOrigins[0]
        )

        abortController.abort()
      } else {
        window.postMessage(
          { source: 'drive-extension', tokenStatus: 'token-not-found' },
          allowedOrigins[0]
        )
      }
    })

    window.addEventListener(
      'message',
      (event) => {
        if (!allowedOrigins.includes(event.origin)) {
          console.warn('Origin not allowed:', event.origin)
          return
        }

        if (event.data?.source === 'drive-web' && ctx.isValid) {
          const token = event.data.payload
          chrome.storage.local.set({ token }, () => {
            console.log('The user has been authenticated in the extension')

            abortController.abort()
          })
        }
      },
      { signal: abortController.signal, once: true }
    )
  },
})
