export default defineContentScript({
  matches: ['*://*/*'],
  main() {
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
          { source: 'drive-extension', payload: 'token-exists' },
          allowedOrigins[0]
        )
      } else {
        window.postMessage(
          { source: 'drive-extension', payload: 'ready' },
          allowedOrigins[0]
        )
      }
    })

    window.addEventListener(
      'message',
      (event) => {
        console.log('MESSAGE RECEIVED:', event)

        if (!allowedOrigins.includes(event.origin)) {
          console.warn('Origin not allowed:', event.origin)
          return
        }

        if (event.data?.source === 'drive-web') {
          const token = event.data.payload
          console.log('TOKEN FETCHED FROM DRIVE WEB')

          chrome.storage.local.set({ token }, () => {
            console.log('TOKEN STORED')
          })
        }
      },
      { signal: abortController.signal }
    )
  },
})
