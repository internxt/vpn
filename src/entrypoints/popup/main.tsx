import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import './style.css'

chrome.storage.local.get(['isVPNEnabled', 'userData'], function (data) {
  console.log('In render', data)

  const userData = data.userData ?? {
    location: '-',
    ip: '-',
  }

  const isVPNEnabled = data.isVPNEnabled ?? 'OFF'

  const storedUserData = {
    isVPNEnabled,
    userData,
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App storedUserData={storedUserData} />
    </React.StrictMode>
  )
})
