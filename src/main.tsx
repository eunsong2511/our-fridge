import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { localRepo } from './lib/storage/local'
import { demoItems, demoShopping } from './lib/demo'

// 피그마 캡처 모드: URL 해시에 figmacapture 가 있을 때만 캡처 스크립트를 로드 (운영 빌드에는 영향 없음)
if (location.hash.includes('figmacapture')) {
  document.documentElement.classList.add('capture')
  const s = document.createElement('script')
  s.src = 'https://mcp.figma.com/mcp/html-to-design/capture.js'
  s.async = true
  document.head.appendChild(s)
}

async function seedDemoIfRequested() {
  const p = new URLSearchParams(location.search)
  if (!p.has('demo')) return
  localStorage.setItem('fridge.localMode', '1')
  if ((await localRepo.listItems()).length === 0) {
    for (const i of demoItems().reverse()) await localRepo.addItem(i)
    for (const s of demoShopping().reverse()) await localRepo.addShopping(s)
  }
}

seedDemoIfRequested().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
