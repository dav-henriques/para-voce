// Respeita quem prefere menos movimento (Ajustes › Acessibilidade › Movimento).
const consulta =
  typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null

export const semMovimento = () => Boolean(consulta?.matches)

export const esperar = (ms) => new Promise((r) => setTimeout(r, ms))
