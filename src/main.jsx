// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <ConfigProvider locale={ruRU}>
      <App />
    </ConfigProvider>
  // </StrictMode>,
)
