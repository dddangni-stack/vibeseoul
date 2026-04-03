/**
 * main.jsx
 * 앱 진입점
 * React DOM에 루트 컴포넌트를 마운트합니다.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
