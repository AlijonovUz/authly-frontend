import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { handleGoogleCallback } from './utils/googleAuth.js'

// Google'dan qaytgan popup natijani asosiy oynaga yuborib yopiladi — ilova chizilmaydi
if (!handleGoogleCallback()) {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
