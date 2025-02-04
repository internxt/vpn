import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import './style.css'

chrome.storage.local.get(
  ['isVPNEnabled', 'userData', 'token'],
  function (data) {
    const userData = data.userData ?? {
      location: '-',
      ip: '-',
    }
    const isVPNEnabled = data.isVPNEnabled ?? 'OFF'
    const authToken = data.token ?? undefined

    const storedUserData = {
      isVPNEnabled,
      userData,
      authToken,
    }

    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <App storedUserData={storedUserData} />
      </React.StrictMode>
    )
  }
)
