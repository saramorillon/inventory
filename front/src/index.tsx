import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './views/App'

const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(<App />)
}
