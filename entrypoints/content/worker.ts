// Work around for: https://github.com/wxt-dev/wxt/issues/942
// @ts-ignore
globalThis._content = undefined

self.onmessage = (event) => {
  console.log('Message received:', event.data)

  if (event.data.token) {
    self.postMessage({ success: true, token: event.data.token })
  } else {
    self.postMessage({ success: false, message: 'Token not found' })
  }
}
