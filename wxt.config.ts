import { defineConfig } from 'wxt'
import react from '@vitejs/plugin-react'

export default defineConfig({
  vite: () => ({
    plugins: [react()],
  }),
  modules: ['@wxt-dev/i18n/module'],
  srcDir: 'src',
  manifest: {
    name: 'Internxt VPN - Free, Encrypted & Unlimited VPN',
    short_name: 'Internxt VPN',
    default_locale: 'en',
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
      'webRequestAuthProvider',
      'browsingData',
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
