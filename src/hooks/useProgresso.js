import { useCallback, useEffect, useMemo, useState } from 'react'
import { todosBilhetes } from '../lib/bilhetes.js'

const CHAVE = 'para-voce:progresso:v1'

function carregar() {
  try {
    const dados = JSON.parse(localStorage.getItem(CHAVE) ?? 'null')
    if (dados && Array.isArray(dados.abertos)) {
      return { abertos: dados.abertos, recentes: Array.isArray(dados.recentes) ? dados.recentes : [] }
    }
  } catch {
    /* sem localStorage (modo privado antigo): segue sem lembrar */
  }
  return { abertos: [], recentes: [] }
}

// Abrir com ?recomecar zera o progresso (útil pra testar antes de dar o presente).
export function recomecarSePedido() {
  const params = new URLSearchParams(location.search)
  if (!params.has('recomecar')) return
  try {
    localStorage.removeItem(CHAVE)
  } catch {
    /* ignora */
  }
  params.delete('recomecar')
  const busca = params.toString()
  history.replaceState(null, '', location.pathname + (busca ? `?${busca}` : '') + location.hash)
}

export function useProgresso() {
  const [estado, setEstado] = useState(carregar)

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(estado))
    } catch {
      /* ignora */
    }
  }, [estado])

  // Só conta bilhetes que ainda existem no content.js
  const abertos = useMemo(() => {
    const existentes = new Set(todosBilhetes.map((b) => b.id))
    return new Set(estado.abertos.filter((id) => existentes.has(id)))
  }, [estado.abertos])

  const registrar = useCallback((id) => {
    setEstado((e) => ({
      abertos: e.abertos.includes(id) ? e.abertos : [...e.abertos, id],
      recentes: [...e.recentes.filter((r) => r !== id), id].slice(-80),
    }))
  }, [])

  return { abertos, recentes: estado.recentes, registrar }
}
