import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// 初始化主题（避免闪烁）
const stored = JSON.parse(localStorage.getItem('bible-store') || '{}')?.state?.theme ?? 'system'
if (stored === 'dark') {
  document.documentElement.classList.add('dark')
} else if (stored === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.classList.add('dark')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
