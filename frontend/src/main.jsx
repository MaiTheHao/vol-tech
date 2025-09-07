import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Routers } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <Routers>
    <StrictMode>
      <App />
    </StrictMode>,
  </Routers>
)
