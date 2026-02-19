import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CookiesProvider } from 'react-cookie'

import { AppProvider } from './AppContext.jsx'
import App from './App.jsx'

import 'react-toastify/dist/ReactToastify.css'
import 'simplebar-react/dist/simplebar.min.css'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

import './index.css'

createRoot(document.getElementById('root')).render(
  <CookiesProvider defaultSetOptions={{ path: '/' }}>
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </CookiesProvider>
)
