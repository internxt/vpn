export default defineContentScript({
  matches: ['*://*/*'],
  main() {
    const allowedOrigins = [
      'https://drive.internxt.com',
      'http://localhost:3000',
    ]

    const abortController = new AbortController()

    window.postMessage(
      { source: 'drive-extension', payload: 'ready' },
      'http://localhost:3000'
    )

    window.addEventListener(
      'message',
      (event) => {
        console.log('MESSAGE RECEIVED:', event)

        if (!allowedOrigins.includes(event.origin)) {
          console.warn('Origin not allowed:', event.origin)
          return
        }

        if (event.data && event.data.source === 'drive-web') {
          console.log(
            'Content script got data from web app:',
            event.data.payload
          )

          chrome.storage.local.set({ token: event.data.payload }, () => {
            console.log('Token saved.')

            abortController.abort()
          })
        }
      },
      { signal: abortController.signal }
    )
  },
})
