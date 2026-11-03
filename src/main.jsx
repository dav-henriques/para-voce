import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/caveat/wght.css'
import '@fontsource-variable/nunito/wght.css'
import './styles/base.css'
import './styles/inicio.css'
import './styles/papel.css'
import App from './App.jsx'
import { config } from './content.js'
import { asset } from './lib/asset.js'
import { recomecarSePedido } from './hooks/useProgresso.js'
import { ehIOS, ehStandalone } from './hooks/usePwa.js'

recomecarSePedido()

// Sem zoom por gesto e sem duplo-toque ampliando a tela
document.addEventListener('gesturestart', (e) => e.preventDefault())
document.addEventListener('dblclick', (e) => e.preventDefault(), { passive: false })

// No iPhone instalado, a barra de status fica sobre uma faixinha vinho
if (ehIOS && ehStandalone()) document.documentElement.classList.add('ios-app')

// Pede ao navegador para não apagar o progresso dela
navigator.storage?.persist?.().catch(() => {})

// Deixa a música guardada para tocar offline também
if ('serviceWorker' in navigator && config.musica?.arquivo && import.meta.env.PROD) {
  const guardarMusica = () => setTimeout(() => fetch(asset(config.musica.arquivo)).catch(() => {}), 2500)
  if (navigator.serviceWorker.controller) guardarMusica()
  else navigator.serviceWorker.addEventListener('controllerchange', guardarMusica, { once: true })
}

// Espera as fontes (que vêm junto com o app) para medir os bilhetes certinho
const fontes = Promise.all([
  document.fonts.load('600 1em "Caveat Variable"'),
  document.fonts.load('500 1em "Nunito Variable"'),
  document.fonts.load('700 1em "Nunito Variable"'),
]).catch(() => {})

Promise.race([fontes, new Promise((r) => setTimeout(r, 1800))]).then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
