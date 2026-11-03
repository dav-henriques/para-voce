import { categorias, bilhetes as brutos } from '../content.js'

// Gera um id estável a partir do texto, para lembrar o que já foi lido
// sem você precisar numerar nada no content.js.
function hash(texto) {
  let h = 2166136261
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0).toString(36)
}

export const listaCategorias = categorias

export const categoriaPorId = Object.fromEntries(categorias.map((c) => [c.id, c]))

export const todosBilhetes = (() => {
  const vistos = new Set()
  const lista = []
  for (const cat of categorias) {
    for (const item of brutos[cat.id] ?? []) {
      const b = typeof item === 'string' ? { texto: item } : { ...item }
      if (!b.texto && !b.foto) continue
      let id = b.id ?? `${cat.id}-${hash(`${b.texto ?? ''}|${b.foto ?? ''}`)}`
      while (vistos.has(id)) id += '+'
      vistos.add(id)
      lista.push({ ...b, id, categoria: cat.id })
    }
  }
  if (import.meta.env.DEV) {
    for (const chave of Object.keys(brutos)) {
      if (!categoriaPorId[chave]) console.warn(`[content.js] categoria "${chave}" não existe em \`categorias\``)
    }
  }
  return lista
})()

const aleatorio = (lista) => lista[Math.floor(Math.random() * lista.length)]

// Sorteia priorizando bilhetes ainda fechados. Quando todos já foram lidos,
// continua sorteando, mas evita repetir os mais recentes.
export function sortearBilhete({ abertos, recentes, categoria }) {
  const pool = categoria ? todosBilhetes.filter((b) => b.categoria === categoria) : todosBilhetes
  if (!pool.length) return null

  const fechados = pool.filter((b) => !abertos.has(b.id))
  if (fechados.length) return aleatorio(fechados)

  const idsPool = new Set(pool.map((b) => b.id))
  const recentesDoPool = recentes.filter((id) => idsPool.has(id))
  const evitar = new Set(recentesDoPool.slice(-Math.floor(pool.length / 2)))
  const opcoes = pool.filter((b) => !evitar.has(b.id))
  return aleatorio(opcoes.length ? opcoes : pool)
}

// Tamanho da letra conforme o comprimento da mensagem
export function tamanhoDoTexto(texto = '') {
  const n = texto.length
  if (n <= 48) return 'g'
  if (n <= 110) return 'm'
  if (n <= 200) return 'p'
  return 'pp'
}
