import { forwardRef, useImperativeHandle, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'

/*
  Um papel dobrado em 2 ou 3 partes que se desdobra de verdade.

  Durante a animação, o mesmo conteúdo é desenhado em "faixas" (uma por dobra),
  cada uma girando no próprio vinco. Quando termina, as faixas somem e fica só
  o papel "assentado" (com rolagem, texto selecionável etc.) — idêntico, então
  a troca é invisível.
*/

// Bordinha irregular do papel (sempre a mesma)
const RECORTE = (() => {
  let s = 7
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647)
  const p = []
  const lado = (n, f) => {
    for (let i = 0; i < n; i++) p.push(f(i / n, r()))
  }
  lado(9, (t, j) => `${(t * 100).toFixed(2)}% ${(j * 0.55).toFixed(2)}%`)
  lado(12, (t, j) => `${(100 - j * 0.7).toFixed(2)}% ${(t * 100).toFixed(2)}%`)
  lado(9, (t, j) => `${(100 - t * 100).toFixed(2)}% ${(100 - j * 0.55).toFixed(2)}%`)
  lado(12, (t, j) => `${(j * 0.7).toFixed(2)}% ${(100 - t * 100).toFixed(2)}%`)
  return `polygon(${p.join(',')})`
})()

const FIXA = 1 // a faixa do meio (3 dobras) ou a de baixo (2 dobras) não se mexe

function Folha({ children, verso, dobras, rolavel, estilo }) {
  return (
    <div className={`folha${verso ? ' folha-verso' : ''}`} style={{ clipPath: RECORTE, ...estilo }}>
      {verso ? (
        verso
      ) : (
        <>
          <div className={`folha-rolagem${rolavel ? ' folha-rolagem--rolavel' : ''}`}>{children}</div>
          {Array.from({ length: dobras - 1 }, (_, i) => (
            <i key={i} className="folha-vinco" style={{ top: `${((i + 1) * 100) / dobras}%` }} />
          ))}
        </>
      )}
    </div>
  )
}

export const PapelDobravel = forwardRef(function PapelDobravel(
  { dobras = 3, children, verso, selo, seloCobre = false, rolavel = false, className = '', estilo },
  ref,
) {
  const raizRef = useRef(null)
  const assentadoRef = useRef(null)
  const faixasRef = useRef(null)
  const faixaRef = useRef([])
  const sombraRef = useRef(null)
  const seloRef = useRef(null)
  const H = useRef(0)
  const angulos = useRef({ topo: 0, base: 0 })

  const indices = dobras === 3 ? [FIXA, 2, 0] : [FIXA, 0] // ordem de pintura: dobras por cima

  function aplicar() {
    const { topo, base } = angulos.current
    for (const i of indices) {
      if (i === FIXA) continue
      const el = faixaRef.current[i]
      if (!el) continue
      const a = i === 0 ? topo : base
      el.style.transform = `perspective(1300px) rotateX(${a}deg)`
      const mostraVerso = Math.abs(a) > 90
      // 'inherit' (e não 'visible') para sumir junto quando as faixas são escondidas
      el.children[0].style.visibility = mostraVerso ? 'hidden' : 'inherit'
      el.children[1].style.visibility = mostraVerso ? 'inherit' : 'hidden'
      const luz = 1 - Math.abs(Math.cos((a * Math.PI) / 180))
      el.style.setProperty('--sombra', (luz * (mostraVerso ? 0.3 : 0.22)).toFixed(3))
    }
  }

  function medir() {
    const el = assentadoRef.current
    el.style.height = ''
    const bruto = el.getBoundingClientRect().height
    const h = Math.ceil(bruto / dobras) * dobras
    H.current = h
    raizRef.current.style.setProperty('--h', `${h}px`)
    el.style.height = `${h}px`
    return h
  }

  function mostrarFaixas(sim) {
    faixasRef.current.style.visibility = sim ? 'visible' : 'hidden'
    assentadoRef.current.style.visibility = sim ? 'hidden' : 'visible'
  }

  useLayoutEffect(() => {
    medir()
    mostrarFaixas(false)
    if (!rolavel) return
    // esmaece o pé da folha enquanto ainda houver texto para rolar
    const caixa = assentadoRef.current.querySelector('.folha-rolagem')
    const atualizar = () => {
      const falta = caixa.scrollHeight - caixa.clientHeight - caixa.scrollTop
      raizRef.current.classList.toggle('papel--transborda', falta > 6)
    }
    atualizar()
    caixa.addEventListener('scroll', atualizar, { passive: true })
    return () => caixa.removeEventListener('scroll', atualizar)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const faixa = () => H.current / dobras // altura de uma faixa

  useImperativeHandle(ref, () => ({
    medir,
    get altura() {
      return H.current
    },
    // centro do papel dobrado, medido do topo do papel aberto
    get centroDobrado() {
      return (FIXA + 0.5) * faixa()
    },
    seloEl: () => seloRef.current,

    dobrar() {
      medir()
      angulos.current = { topo: -180, base: dobras === 3 ? 180 : 0 }
      aplicar()
      mostrarFaixas(true)
      const f = faixa()
      gsap.set(sombraRef.current, { top: FIXA * f, bottom: H.current - (FIXA + 1) * f })
      if (seloRef.current) {
        gsap.set(seloRef.current, { autoAlpha: 1, scale: 1 })
        if (seloCobre) gsap.set(seloRef.current.querySelector('svg'), { scale: 1, rotation: 0, y: 0 })
      }
    },

    abrir({ aoSoltarSelo } = {}) {
      const tl = gsap.timeline()
      if (seloRef.current) {
        // o adesivo pula e some; o lacinho (seloCobre) se desfaz
        const alvo = seloCobre ? seloRef.current.querySelector('svg') : seloRef.current
        tl.to(alvo, { scale: 1.25, rotation: seloCobre ? -12 : 0, duration: 0.16, ease: 'power2.out' })
          .add(() => aoSoltarSelo?.())
          .to(seloRef.current, { autoAlpha: 0, duration: 0.24, ease: 'power2.in' })
          .to(alvo, { scale: seloCobre ? 0.7 : 0.2, y: seloCobre ? -14 : 0, duration: 0.24, ease: 'power2.in' }, '<')
      }
      tl.to(angulos.current, { topo: 0, duration: 0.66, ease: 'power2.inOut', onUpdate: aplicar }, '>-0.04')
      tl.to(sombraRef.current, { top: 0, duration: 0.66, ease: 'power2.inOut' }, '<')
      if (dobras === 3) {
        tl.to(angulos.current, { base: 0, duration: 0.58, ease: 'power2.inOut', onUpdate: aplicar }, '>-0.24')
        tl.to(sombraRef.current, { bottom: 0, duration: 0.58, ease: 'power2.inOut' }, '<')
      } else {
        tl.set(sombraRef.current, { bottom: 0 }, '<')
      }
      tl.add(() => mostrarFaixas(false))
      return tl
    },

    fechar({ rapido = false } = {}) {
      const tl = gsap.timeline()
      const el = assentadoRef.current.querySelector('.folha-rolagem')
      if (el) el.scrollTop = 0
      mostrarFaixas(true)
      aplicar()
      const f = faixa()
      const d = rapido ? 0.7 : 1
      if (dobras === 3) {
        tl.to(angulos.current, { base: 180, duration: 0.42 * d, ease: 'power2.inOut', onUpdate: aplicar })
        tl.to(sombraRef.current, { bottom: H.current - (FIXA + 1) * f, duration: 0.42 * d, ease: 'power2.inOut' }, '<')
      }
      tl.to(angulos.current, { topo: -180, duration: 0.46 * d, ease: 'power2.inOut', onUpdate: aplicar }, '>-0.12')
      tl.to(sombraRef.current, { top: FIXA * f, duration: 0.46 * d, ease: 'power2.inOut' }, '<')
      if (seloRef.current) {
        const alvo = seloCobre ? seloRef.current.querySelector('svg') : seloRef.current
        tl.to(seloRef.current, { autoAlpha: 1, duration: 0.2 }).to(
          alvo,
          { scale: 1, rotation: 0, y: 0, duration: 0.3, ease: 'back.out(2)' },
          '<',
        )
      }
      return tl
    },
  }))

  // adesivo: na borda livre da aba de fora · lacinho: cobrindo o papel dobrado
  const estiloSelo = seloCobre
    ? { top: `calc(var(--h) * ${FIXA / dobras})`, height: `calc(var(--h) / ${dobras})` }
    : { top: `calc(var(--h) * ${(FIXA + 1) / dobras})` }

  return (
    <div ref={raizRef} className={`papel ${className}`} style={estilo}>
      <div ref={sombraRef} className="papel-sombra" />

      <div ref={assentadoRef} className="papel-assentado">
        <Folha dobras={dobras} rolavel={rolavel}>
          {children}
        </Folha>
      </div>

      <div ref={faixasRef} className="papel-faixas" aria-hidden="true">
        {indices.map((i) => (
          <div
            key={i}
            ref={(el) => (faixaRef.current[i] = el)}
            className="faixa"
            style={{
              top: `calc(var(--h) * ${i / dobras})`,
              height: `calc(var(--h) / ${dobras} + ${i === dobras - 1 ? 0 : 1}px)`,
              transformOrigin: i === 0 ? '50% 100%' : '50% 0%',
              zIndex: i === FIXA ? 1 : 2,
            }}
          >
            <div className="faixa-face">
              <div className="faixa-desloca" style={{ top: `calc(var(--h) * ${-i / dobras})` }}>
                <Folha dobras={dobras}>{children}</Folha>
              </div>
            </div>
            <div className="faixa-face" style={{ visibility: 'hidden' }}>
              <div className="faixa-desloca" style={{ top: `calc(var(--h) * ${-i / dobras})` }}>
                <Folha dobras={dobras} verso={verso} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {selo && (
        <div ref={seloRef} className={`papel-selo${seloCobre ? ' papel-selo--cobre' : ''}`} style={estiloSelo} aria-hidden="true">
          {selo}
        </div>
      )}
    </div>
  )
})
