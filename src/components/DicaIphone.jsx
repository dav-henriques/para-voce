import { useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { Compass, Share, SquarePlus, X } from 'lucide-react'
import { CoracaoCheio } from './Rabiscos.jsx'
import { semMovimento } from '../lib/movimento.js'

// Uma folhinha que sobe de baixo explicando como guardar o site na tela de início
export function DicaIphone({ aoFechar, ehIOS, instalar }) {
  const veuRef = useRef(null)
  const folhaRef = useRef(null)
  const fechando = useRef(false)

  useLayoutEffect(() => {
    if (semMovimento()) return
    gsap.fromTo(veuRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 })
    gsap.fromTo(folhaRef.current, { yPercent: 105, rotation: 2 }, { yPercent: 0, rotation: 0, duration: 0.55, ease: 'power3.out' })
    folhaRef.current.querySelector('.dica-fechar')?.focus({ preventScroll: true })
  }, [])

  const fechar = () => {
    if (fechando.current) return
    fechando.current = true
    if (semMovimento()) return aoFechar()
    gsap.to(veuRef.current, { autoAlpha: 0, duration: 0.3 })
    gsap.to(folhaRef.current, { yPercent: 105, duration: 0.4, ease: 'power2.in', onComplete: aoFechar })
  }

  useEffect(() => {
    const aoTeclar = (e) => e.key === 'Escape' && fechar()
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  })

  const passos = ehIOS
    ? [
        { Icone: Compass, texto: <>abra este site no <b>Safari</b></> },
        {
          Icone: Share,
          texto: (
            <>
              toque no botão de <b>compartilhar</b>
              <small>no iOS mais novo, ele fica dentro do menu ···</small>
            </>
          ),
        },
        { Icone: SquarePlus, texto: <>escolha <b>“Adicionar à Tela de Início”</b></> },
        { Icone: CoracaoCheio, texto: <>toque em <b>Adicionar</b> — pronto, ele vira um app <CoracaoCheio className="coracao-inline" /></> },
      ]
    : [
        { Icone: Compass, texto: <>abra este site no navegador do celular</> },
        { Icone: Share, texto: <>abra o menu <b>⋮</b> (ou o de compartilhar)</> },
        { Icone: SquarePlus, texto: <>escolha <b>“Adicionar à tela inicial”</b> ou <b>“Instalar app”</b></> },
        { Icone: CoracaoCheio, texto: <>confirme — pronto, ele vira um app <CoracaoCheio className="coracao-inline" /></> },
      ]

  return (
    <div className="dica" role="dialog" aria-modal="true" aria-labelledby="dica-titulo">
      <div className="dica-veu" ref={veuRef} onClick={fechar} />
      <div className="dica-folha" ref={folhaRef}>
        <button type="button" className="dica-fechar" onClick={fechar} aria-label="fechar">
          <X aria-hidden="true" strokeWidth={2} />
        </button>
        <h2 id="dica-titulo">guardar esse cantinho no seu {ehIOS ? 'iPhone' : 'celular'}</h2>
        <p className="dica-intro">assim ele fica na sua tela de início, com ícone, e abre como um aplicativo — até sem internet.</p>
        <ol className="dica-passos">
          {passos.map(({ Icone, texto }, i) => (
            <li key={i}>
              <span className="dica-numero">{i + 1}</span>
              <span className="dica-texto">{texto}</span>
              <Icone className="dica-icone" aria-hidden="true" strokeWidth={1.8} />
            </li>
          ))}
        </ol>
        {instalar && (
          <button type="button" className="botao botao--primario dica-instalar" onClick={instalar}>
            instalar agora
          </button>
        )}
      </div>
    </div>
  )
}
