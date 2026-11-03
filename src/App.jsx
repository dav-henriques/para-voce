import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

import { config, inicio, textos, cartaEspecial } from './content.js'
import { categoriaPorId, listaCategorias, sortearBilhete, todosBilhetes } from './lib/bilhetes.js'
import { prepararCoracoes } from './lib/coracoes.js'
import { semMovimento } from './lib/movimento.js'
import { useProgresso } from './hooks/useProgresso.js'
import { useMusica } from './hooks/useMusica.js'
import { usePwa } from './hooks/usePwa.js'

import { Pote } from './components/Pote.jsx'
import { CartaFechada } from './components/CartaFechada.jsx'
import { Palco } from './components/Palco.jsx'
import { DicaIphone } from './components/DicaIphone.jsx'
import { Texto } from './components/Texto.jsx'
import { SetaCurva } from './components/Rabiscos.jsx'
import { BotaoMusica, Botao, Categorias, Fundo, LinkDica, Progresso } from './components/Inicio.jsx'
import {
  ConteudoBilhete,
  ConteudoCarta,
  LacoCarta,
  SeloCoracao,
  VersoBilhete,
  VersoCarta,
} from './components/Conteudos.jsx'

export default function App() {
  const { abertos, recentes, registrar } = useProgresso()
  const musica = useMusica(config.musica)
  const pwa = usePwa()

  const [categoria, setCategoria] = useState(null)
  const [cena, setCena] = useState(null) // null | { tipo: 'nota' | 'carta', ... }
  const [dica, setDica] = useState(false)

  const inicioRef = useRef(null)
  const poteRef = useRef(null)
  const cartaRef = useRef(null)
  const palcoRef = useRef(null)
  const progressoRef = useRef(null)
  const veuRef = useRef(null)
  const canvasRef = useRef(null)
  const ocupado = useRef(false) // uma animação de abertura está em andamento
  const fechando = useRef(false)
  const atual = useRef({})
  atual.current = { abertos, recentes, categoria }

  useEffect(() => prepararCoracoes(canvasRef.current), [])

  // entrada suave da tela inicial
  useGSAP(
    () => {
      if (semMovimento()) return
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('.inicio-saudacao > *', { y: 18, autoAlpha: 0, duration: 0.9, stagger: 0.13 })
        .from('.pote', { y: -26, autoAlpha: 0, scale: 0.95, duration: 1.1, ease: 'back.out(1.5)' }, 0.3)
        .from('.carta-fechada', { x: 26, rotation: 9, autoAlpha: 0, duration: 0.9 }, 0.75)
        .from('.chamada, .controles > *, .link-dica', { y: 10, autoAlpha: 0, duration: 0.7, stagger: 0.09 }, 0.9)
    },
    { scope: inicioRef },
  )

  // ── contagens ────────────────────────────────────────────────────────────
  const total = todosBilhetes.length
  const fechadosPorCategoria = useMemo(() => {
    const c = Object.fromEntries(listaCategorias.map((cat) => [cat.id, 0]))
    for (const b of todosBilhetes) if (!abertos.has(b.id)) c[b.categoria]++
    return c
  }, [abertos])
  const restantes = categoria ? fechadosPorCategoria[categoria] : total - abertos.size

  // ── véu (fundo desfocado atrás do bilhete) ──────────────────────────────
  const mostrarVeu = (sim, atraso = 0) =>
    gsap.to(veuRef.current, { autoAlpha: sim ? 1 : 0, duration: sim ? 0.5 : 0.45, delay: atraso, overwrite: true })

  // ── abrir um bilhete do potinho ─────────────────────────────────────────
  const tirarDoPote = useCallback(() => {
    const { abertos, recentes, categoria } = atual.current
    const bilhete = sortearBilhete({ abertos, recentes, categoria })
    if (!bilhete) return false
    poteRef.current.balancar()
    const boca = poteRef.current.boca()
    registrar(bilhete.id)
    setCena({
      tipo: 'nota',
      bilhete,
      chave: `${bilhete.id}-${Date.now()}`,
      origem: { ...boca, largura: boca.largura * 0.55, atraso: 0.24 },
    })
    return true
  }, [registrar])

  const abrirPote = () => {
    if (ocupado.current || cena) return
    ocupado.current = true
    mostrarVeu(true, 0.15)
    if (!tirarDoPote()) {
      ocupado.current = false
      mostrarVeu(false)
    }
  }

  const abrirCarta = () => {
    if (ocupado.current || cena) return
    ocupado.current = true
    const r = cartaRef.current.rect()
    gsap.set('.carta-fechada', { autoAlpha: 0 })
    mostrarVeu(true)
    setCena({
      tipo: 'carta',
      chave: `carta-${Date.now()}`,
      origem: { x: r.left + r.width / 2, y: r.top + r.height / 2, largura: r.width * 0.94, rotacao: -7, subir: false },
    })
  }

  const pronto = useCallback(() => {
    ocupado.current = false
  }, [])

  // ── fechar ──────────────────────────────────────────────────────────────
  const guardar = async () => {
    if (!cena || fechando.current) return
    fechando.current = true
    ocupado.current = true
    let destino
    if (cena.tipo === 'nota') {
      destino = progressoRef.current.alvo()
    } else {
      const r = cartaRef.current.rect()
      destino = { x: r.left + r.width / 2, y: r.top + r.height / 2, largura: r.width * 0.94, rotacao: -7, manter: true }
    }
    mostrarVeu(false, cena.tipo === 'nota' ? 0.55 : 0.4)
    await palcoRef.current?.guardar(destino)
    if (cena.tipo === 'nota') progressoRef.current.pulsar()
    else {
      gsap.set('.carta-fechada', { autoAlpha: 1 })
      cartaRef.current.reamarrar()
    }
    setCena(null)
    ocupado.current = false
    fechando.current = false
  }

  const maisUm = async () => {
    if (ocupado.current || fechando.current) return
    ocupado.current = true
    fechando.current = true
    await palcoRef.current?.dispensar()
    fechando.current = false
    if (!tirarDoPote()) {
      ocupado.current = false
      setCena(null)
      mostrarVeu(false)
    }
  }

  // ── conteúdo do palco ───────────────────────────────────────────────────
  let palco = null
  if (cena?.tipo === 'nota') {
    const cat = categoriaPorId[cena.bilhete.categoria]
    palco = (
      <Palco
        key={cena.chave}
        ref={palcoRef}
        tipo="nota"
        dobras={3}
        origem={cena.origem}
        rotulo={`bilhetinho de ${cat.nome}`}
        textoVoltar={textos.voltar}
        aoVoltar={guardar}
        aoPronto={pronto}
        papel={<ConteudoBilhete bilhete={cena.bilhete} categoria={cat} assinatura={config.assinatura} />}
        verso={<VersoBilhete cor={cat.papel} />}
        selo={<SeloCoracao cor={cat.selo} />}
        acoes={
          <>
            <Botao onClick={guardar}>
              <Texto>{textos.guardar}</Texto>
            </Botao>
            <Botao variante="secundario" onClick={maisUm}>
              <Texto>{textos.maisUm}</Texto>
            </Botao>
          </>
        }
      />
    )
  } else if (cena?.tipo === 'carta') {
    palco = (
      <Palco
        key={cena.chave}
        ref={palcoRef}
        tipo="carta"
        dobras={2}
        rolavel
        seloCobre
        origem={cena.origem}
        rotulo={cartaEspecial.titulo}
        textoVoltar={textos.voltar}
        aoVoltar={guardar}
        aoPronto={pronto}
        papel={<ConteudoCarta carta={cartaEspecial} />}
        verso={<VersoCarta />}
        selo={<LacoCarta titulo={cartaEspecial.titulo} />}
        acoes={
          <Botao onClick={guardar}>
            <Texto>{textos.guardarCarta}</Texto>
          </Botao>
        }
      />
    )
  }

  const nomeCategoria = categoria ? categoriaPorId[categoria]?.nome : null

  return (
    <div className="app">
      {/* filtro que deixa os contornos com cara de traço à mão */}
      <svg className="defs" aria-hidden="true" focusable="false">
        <filter id="rabisco" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="ruido" />
          <feDisplacementMap in="SourceGraphic" in2="ruido" scale="2.6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div className="faixa-status" aria-hidden="true" />
      <Fundo />

      <main className="inicio" ref={inicioRef} inert={Boolean(cena) || dica}>
        <header className="inicio-saudacao">
          <h1>
            <Texto>{inicio.saudacao}</Texto>
          </h1>
          <p className="inicio-subtitulo">
            <Texto>{inicio.subtitulo}</Texto>
          </p>
          <p className="inicio-texto">
            <Texto>{inicio.texto}</Texto>
          </p>
        </header>

        <section className="cena" aria-label="o potinho">
          <div className="cena-grupo">
            <Pote ref={poteRef} aoAbrir={abrirPote} pausado={Boolean(cena)} rotulo="tirar um bilhetinho do potinho" />
            <CartaFechada ref={cartaRef} titulo={cartaEspecial.titulo} aoAbrir={abrirCarta} />
          </div>
        </section>

        <p className="chamada">
          <SetaCurva className="chamada-seta" />
          <Texto>{inicio.chamada}</Texto>
        </p>

        <div className="controles">
          <Categorias
            categorias={listaCategorias}
            selecionada={categoria}
            aoEscolher={setCategoria}
            rotuloTodas={textos.qualquerUm}
            titulo={textos.escolherCategoria}
          />
          <Progresso
            ref={progressoRef}
            abertos={abertos.size}
            total={total}
            restantes={restantes}
            nomeCategoria={nomeCategoria}
            textoTodos={textos.todosAbertos}
          />
        </div>

        {!pwa.instalado && <LinkDica texto={textos.dicaIphone} aoAbrir={() => setDica(true)} />}
      </main>

      {musica.disponivel && (
        <div className="barra-topo">
          <BotaoMusica ligada={musica.ligada} alternar={musica.alternar} />
        </div>
      )}

      <div className="veu" ref={veuRef} />
      <canvas className="coracoes" ref={canvasRef} aria-hidden="true" />
      {palco}
      {dica && <DicaIphone aoFechar={() => setDica(false)} ehIOS={pwa.ehIOS} instalar={pwa.instalar} />}
    </div>
  )
}
