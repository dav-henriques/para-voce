import { useCallback, useEffect, useRef, useState } from 'react'
import { Howl, Howler } from 'howler'
import { asset } from '../lib/asset.js'

Howler.autoUnlock = false // só mexe no áudio quando ela ligar a música

export function useMusica(musica) {
  const somRef = useRef(null)
  const ligadaRef = useRef(false)
  const pausadaPeloSistema = useRef(false)
  const [ligada, setLigada] = useState(false)
  const volume = musica?.volume ?? 0.55

  const alternar = useCallback(() => {
    if (!musica?.arquivo) return
    if (!somRef.current) {
      try {
        // No iPhone, toca mesmo com o modo silencioso ativado (Safari 17+)
        if (navigator.audioSession) navigator.audioSession.type = 'playback'
      } catch {
        /* ignora */
      }
      somRef.current = new Howl({
        src: [asset(musica.arquivo)],
        loop: true,
        volume: 0,
        html5: Boolean(musica.streaming),
      })
    }
    const som = somRef.current
    const ligar = !ligadaRef.current
    ligadaRef.current = ligar
    setLigada(ligar)

    if (ligar) {
      if (!som.playing()) som.play()
      som.fade(som.volume(), volume, 1400)
    } else {
      som.fade(som.volume(), 0, 700)
      som.once('fade', () => {
        if (!ligadaRef.current) som.pause()
      })
    }
  }, [musica, volume])

  // Pausa quando o app vai pro fundo e volta quando ela retorna
  useEffect(() => {
    const aoMudar = () => {
      const som = somRef.current
      if (!som) return
      if (document.hidden && som.playing()) {
        pausadaPeloSistema.current = true
        som.pause()
      } else if (!document.hidden && pausadaPeloSistema.current && ligadaRef.current) {
        pausadaPeloSistema.current = false
        som.play()
      }
    }
    document.addEventListener('visibilitychange', aoMudar)
    return () => document.removeEventListener('visibilitychange', aoMudar)
  }, [])

  useEffect(() => () => somRef.current?.unload(), [])

  return { ligada, alternar, disponivel: Boolean(musica?.arquivo) }
}
