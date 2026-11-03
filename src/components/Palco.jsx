import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ArrowLeft } from 'lucide-react'
import { PapelDobravel } from './PapelDobravel.jsx'
import { Texto } from './Texto.jsx'
import { soltarCoracoes } from '../lib/coracoes.js'
import { semMovimento } from '../lib/movimento.js'

/*
  O "palco" onde um bilhete (ou a carta especial) aparece:
  sai voando da origem, para no centro, desdobra e mostra a mensagem.
*/
export const Palco = forwardRef(function Palco(
  { dobras, papel, verso, selo, seloCobre, rolavel, origem, rotulo, textoVoltar, acoes, aoVoltar, aoPronto, tipo },
  ref,
) {
  const cartaoRef = useRef(null)
  const papelRef = useRef(null)
  const acoesRef = useRef(null)
  const voltarRef = useRef(null)
  const geo = useRef(null)
  const animacao = useRef(null)

  // posição de layout (sem transformações) do centro do papel dobrado
  function medirGeo() {
    const p = papelRef.current
    const r = cartaoRef.current.getBoundingClientRect()
    const yc = p.centroDobrado
    geo.current = {
      cx: r.left + r.width / 2,
      cy: r.top + yc,
      largura: r.width,
      ajuste: yc - p.altura / 2, // o papel dobrado em 2 fica "abaixo" do centro
    }
    return geo.current
  }

  useLayoutEffect(() => {
    const p = papelRef.current
    const cartao = cartaoRef.current
    const extras = [voltarRef.current, acoesRef.current]
    p.dobrar()
    const g = medirGeo()
    gsap.set(cartao, { transformOrigin: `50% ${p.centroDobrado}px` })
    gsap.set(extras, { autoAlpha: 0, y: 12 })

    const focar = () => {
      acoesRef.current?.querySelector('button')?.focus({ preventScroll: true })
      aoPronto?.()
    }

    if (semMovimento() || !origem) {
      p.abrir().progress(1)
      animacao.current = gsap
        .timeline({ onComplete: focar })
        .fromTo(cartao, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35 })
        .to(extras, { autoAlpha: 1, y: 0, duration: 0.3 }, '<')
      return () => animacao.current?.kill()
    }

    const escala0 = Math.max(0.08, Math.min(1, (origem.largura ?? 50) / g.largura))
    const x0 = origem.x - g.cx
    const y0 = origem.y - g.cy
    const tl = gsap.timeline({ delay: origem.atraso ?? 0, onComplete: focar })
    tl.set(cartao, { x: x0, y: y0, scale: escala0, rotation: origem.rotacao ?? -14, autoAlpha: 1 })
    if (origem.subir !== false) {
      tl.to(cartao, { y: y0 - 84, rotation: 9, scale: escala0 * 1.5, duration: 0.42, ease: 'power2.out' })
    }
    tl.to(cartao, { x: 0, y: -g.ajuste, rotation: -1.5, scale: 1, duration: 0.72, ease: 'power3.inOut' })
      .add(
        p.abrir({
          aoSoltarSelo: () => {
            const s = p.seloEl()?.getBoundingClientRect()
            if (s) soltarCoracoes(s.left + s.width / 2, s.top + s.height / 2)
          },
        }),
      )
      .to(cartao, { y: 0, rotation: 0, duration: 0.7, ease: 'power2.inOut' }, '<0.15')
      .to(extras, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.08, ease: 'power2.out' }, '-=0.25')
    animacao.current = tl
    return () => tl.kill()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Esc volta pro potinho
  useEffect(() => {
    const aoTeclar = (e) => e.key === 'Escape' && aoVoltar?.()
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [aoVoltar])

  useImperativeHandle(ref, () => ({
    // fecha e voa até um ponto (ex.: o coraçãozinho do progresso)
    guardar(destino) {
      animacao.current?.progress(1)
      const p = papelRef.current
      const cartao = cartaoRef.current
      const extras = [voltarRef.current, acoesRef.current]
      const tl = gsap.timeline()
      if (semMovimento()) {
        return tl.to([cartao, ...extras], { autoAlpha: 0, duration: 0.3 })
      }
      const g = geo.current
      tl.to(extras, { autoAlpha: 0, y: 10, duration: 0.22 })
        .add(p.fechar(), '<0.05')
        .to(cartao, { y: -g.ajuste, duration: 0.45, ease: 'power2.inOut' }, '<')
      if (destino) {
        const escalaFinal = destino.largura ? Math.min(1, destino.largura / g.largura) : 0.08
        tl.to(cartao, {
          x: destino.x - g.cx,
          y: destino.y - g.cy,
          scale: escalaFinal,
          rotation: destino.rotacao ?? 18,
          duration: 0.62,
          ease: 'power3.inOut',
        }).to(cartao, { autoAlpha: 0, duration: destino.manter ? 0.01 : 0.2 }, destino.manter ? '>' : '-=0.2')
      } else {
        tl.to(cartao, { y: '-=40', scale: 0.6, autoAlpha: 0, duration: 0.45, ease: 'power2.in' })
      }
      return tl
    },
    // tira da frente rapidinho, pra dar lugar a outro bilhete
    dispensar() {
      animacao.current?.progress(1)
      const p = papelRef.current
      const cartao = cartaoRef.current
      const extras = [voltarRef.current, acoesRef.current]
      const tl = gsap.timeline()
      if (semMovimento()) return tl.to([cartao, ...extras], { autoAlpha: 0, duration: 0.25 })
      tl.to(extras, { autoAlpha: 0, y: 10, duration: 0.2 })
        .add(p.fechar({ rapido: true }), '<')
        .to(cartao, {
          x: () => window.innerWidth * 0.75,
          y: '-=60',
          rotation: 28,
          scale: 0.55,
          autoAlpha: 0,
          duration: 0.5,
          ease: 'power2.in',
        })
      return tl
    },
  }))

  return (
    <div className={`palco palco--${tipo}`} role="dialog" aria-modal="true" aria-label={rotulo}>
      <div className="palco-topo" ref={voltarRef}>
        <button type="button" className="botao-voltar" onClick={aoVoltar}>
          <ArrowLeft aria-hidden="true" strokeWidth={2} />
          <span>
            <Texto>{textoVoltar}</Texto>
          </span>
        </button>
      </div>

      <div className="palco-centro">
        <div className="palco-cartao" ref={cartaoRef}>
          <PapelDobravel
            ref={papelRef}
            dobras={dobras}
            verso={verso}
            selo={selo}
            seloCobre={seloCobre}
            rolavel={rolavel}
            className={`papel--${tipo}`}
          >
            {papel}
          </PapelDobravel>
        </div>
      </div>

      <div className="palco-acoes" ref={acoesRef}>
        {acoes}
      </div>
    </div>
  )
})
