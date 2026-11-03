// Os bilhetinhos desenhados dentro do potinho de vidro.
// Gerados uma única vez, com uma semente fixa: o potinho é sempre o mesmo.

const TINTA = '#8F2638'
const CORES = ['#B83B4B', '#8F2638', '#D96B72', '#F2C6BC', '#FFF5EA', '#C9505E', '#E99C98', '#B83B4B', '#F2C6BC']
const TIPOS = ['dobrado', 'dobrado', 'dobrado', 'rolo', 'coracao', 'dobrado', 'estrela', 'rolo', 'coracao']

function semente(s) {
  return () => {
    s |= 0
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function gerar() {
  const r = semente(21)
  const itens = []
  for (let y = 350; y > 168; y -= 16.5) {
    for (let x = 62 + r() * 18; x < 266; x += 27 + r() * 12) {
      const topo = 198 + Math.sin(x * 0.04 + 0.9) * 9 + r() * 6
      if (y < topo) continue
      itens.push({
        x: x + (r() - 0.5) * 8,
        y: y + (r() - 0.5) * 7,
        rot: (r() - 0.5) * 84,
        s: 1.12 + r() * 0.42,
        tipo: TIPOS[Math.floor(r() * TIPOS.length)],
        cor: CORES[Math.floor(r() * CORES.length)],
      })
    }
  }
  return itens
}

export const notasDoPote = gerar()

export function NotaDoPote({ x, y, rot, s, tipo, cor }) {
  const transform = `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${s.toFixed(2)})`
  const contorno = { stroke: TINTA, strokeWidth: 1.15, strokeLinejoin: 'round', strokeLinecap: 'round' }

  if (tipo === 'rolo') {
    return (
      <g transform={transform}>
        <rect x="-14" y="-5" width="28" height="10" rx="5" fill={cor} {...contorno} />
        <ellipse cx="11.5" cy="0" rx="2.3" ry="4.4" fill="#000" fillOpacity=".1" />
        <path d="M-2.4-5.3v10.6M.8-5.3v10.6" stroke={cor === '#FFF5EA' ? '#B83B4B' : '#FFF5EA'} strokeWidth="1.3" />
      </g>
    )
  }
  if (tipo === 'coracao') {
    return (
      <g transform={transform}>
        <path
          d="M0 7.6C-.4 7.3-7.6 2.9-7.9-1.8-8.1-4.6-6-6.5-3.7-6.4c1.6.1 3 1.2 3.7 2.6.7-1.4 2.1-2.5 3.7-2.6 2.3-.1 4.3 1.8 4.1 4.6C7.6 2.9.4 7.3 0 7.6z"
          fill={cor}
          {...contorno}
        />
        <path d="M0-3.4V7" stroke={TINTA} strokeOpacity=".3" strokeWidth=".9" />
      </g>
    )
  }
  if (tipo === 'estrela') {
    return (
      <g transform={transform}>
        <path
          d="M0-7.6C1.4-3.7 2-3.1 6.9-2.5 3.6.2 3.2 1.2 4.4 6.1.9 3.6-.9 3.6-4.4 6.1-3.2 1.2-3.6.2-6.9-2.5-2-3.1-1.4-3.7 0-7.6z"
          fill={cor}
          {...contorno}
        />
      </g>
    )
  }
  return (
    <g transform={transform}>
      <path d="M-15-9.6 14.6-10.2 15.2 9.7-14.7 10.3z" fill={cor} {...contorno} />
      <path d="M.2-10 14.6-10.2 15.2 9.7.6 10z" fill="#000" fillOpacity=".09" />
      <path d="M.2-10 .6 10" stroke={TINTA} strokeOpacity=".35" strokeWidth=".9" />
    </g>
  )
}
