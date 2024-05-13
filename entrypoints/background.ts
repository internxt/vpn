import { WebRequest } from 'wxt/browser'

export default defineBackground(() => {
  browser.webRequest.onAuthRequired.addListener(
    function (details: WebRequest.OnAuthRequiredDetailsType) {
      if (details.isProxy) {
        return {
          authCredentials: {
            username: import.meta.env.VITE_VPN_USERNAME,
            password: import.meta.env.VITE_VPN_PASSWORD,
          },
        }
      }
    },
    {
      urls: ['<all_urls>'],
    },
    ['blocking']
  )

  browser.webRequest.onErrorOccurred.addListener(
    (error) => {
      console.log('[ERROR OCURRED]:', error)
    },
    { urls: ['<all_urls>'] }
  )
})
