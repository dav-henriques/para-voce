import { useEffect, useState } from 'react'

const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''

export const ehIOS =
  /iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

export const ehStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true

export function usePwa() {
  const [instalado, setInstalado] = useState(ehStandalone)
  const [pedidoInstalacao, setPedido] = useState(null)

  useEffect(() => {
    const consulta = window.matchMedia('(display-mode: standalone)')
    const aoMudar = () => setInstalado(ehStandalone())
    const aoOferecer = (e) => {
      e.preventDefault()
      setPedido(e)
    }
    consulta.addEventListener?.('change', aoMudar)
    window.addEventListener('beforeinstallprompt', aoOferecer)
    window.addEventListener('appinstalled', aoMudar)
    return () => {
      consulta.removeEventListener?.('change', aoMudar)
      window.removeEventListener('beforeinstallprompt', aoOferecer)
      window.removeEventListener('appinstalled', aoMudar)
    }
  }, [])

  const instalar = pedidoInstalacao
    ? async () => {
        pedidoInstalacao.prompt()
        await pedidoInstalacao.userChoice.catch(() => null)
        setPedido(null)
      }
    : null

  return { instalado, instalar, ehIOS }
}
