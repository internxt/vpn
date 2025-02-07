import { defineConfig } from 'wxt'
import react from '@vitejs/plugin-react'

// See https://wxt.dev/api/config.html
export default defineConfig({
  vite: () => ({
    plugins: [react()],
  }),
  manifest: {
    name: 'Internxt VPN - Free, Encrypted & Unlimited VPN',
    short_name: 'Internxt VPN',
    version: '1.0.0',
    description:
      'Internxt free VPN for Chrome: an encrypted, secure VPN built to protect your privacy.',
    icons: {
      '16': '/icon/16.png',
      '48': '/icon/48.png',
      '192': '/icon/192.png',
    },
    permissions: [
      'storage',
      'proxy',
      'webRequest',
      'webRequestBlocking',
      'declarativeNetRequest',
      'webRequestAuthProvider',
    ],
    web_accessible_resources: [
      {
        resources: ['index.html'],
        matches: ['<all_urls>'],
      },
    ],

    host_permissions: ['<all_urls>'],
    action: {
      default_popup: 'index.html',
    },
  },
})
