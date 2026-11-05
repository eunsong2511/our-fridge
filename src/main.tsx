import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { localRepo } from './lib/storage/local'
import { demoItems, demoShopping } from './lib/demo'

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
