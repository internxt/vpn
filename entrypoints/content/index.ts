import MyWorker from './worker?worker&inline'

export default defineContentScript({
  matches: ['*://*/*'],
  main() {
    const worker = new MyWorker()

    window.addEventListener('message', (event) => {
      console.log('MESSAGE RECEIVED: ', event)
      if (event.data && event.data.source === 'drive-web') {
        console.log('Content script got data from web app:', event.data.payload)

        chrome.storage.local.set({
          token: event.data.payload,
        })
        worker.postMessage(event.data.payload)
      }
    })

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      worker.postMessage(request)
      sendResponse({ status: 'MESSAGE SENT TO THE WORKER' })
    })
  },
})
