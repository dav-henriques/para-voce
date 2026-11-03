import { forwardRef, useImperativeHandle, useRef } from 'react'
import gsap from 'gsap'
import { Music, Smartphone } from 'lucide-react'
import { Texto } from './Texto.jsx'
import { Brilho, Circulado, Coracao, CoracaoCheio, Estrela, IconeCategoria } from './Rabiscos.jsx'

// Botão com borda "desenhada à mão"
export function Botao({ variante = 'primario', children, ...props }) {
  return (
    <button type="button" className={`botao botao--${variante}`} {...props}>
      {children}
    </button>
  )
}

// Fundo de papel com alguns rabiscos espalhados
const ENFEITES = [
  { C: Coracao, x: 7, y: 9, t: 20, r: -14, d: 0 },
  { C: Brilho, x: 89, y: 17, t: 18, r: 8, d: 1.2 },
  { C: Estrela, x: 93, y: 45, t: 15, r: 12, d: 2.1 },
  { C: Brilho, x: 6, y: 42, t: 14, r: -6, d: 0.6 },
  { C: Coracao, x: 4.5, y: 64, t: 14, r: 10, d: 1.7 },
  { C: Brilho, x: 95.5, y: 70, t: 15, r: -10, d: 2.6 },
  { C: Estrela, x: 4, y: 96, t: 12, r: 18, d: 3.1 },
  { C: Coracao, x: 95.5, y: 96.5, t: 12, r: -8, d: 0.3 },
]

export function Fundo() {
  return (
    <div className="fundo" aria-hidden="true">
      {ENFEITES.map(({ C, x, y, t, r, d }, i) => (
        <span
          key={i}
          className="fundo-enfeite"
          style={{ left: `${x}%`, top: `${y}%`, fontSize: t, '--r': `${r}deg`, animationDelay: `${d}s` }}
        >
          <C />
        </span>
      ))}
    </div>
  )
}

// Escolha discreta de categoria
export function Categorias({ categorias, selecionada, aoEscolher, rotuloTodas, titulo }) {
  const opcoes = [{ id: null, nome: rotuloTodas, icone: 'potinho' }, ...categorias]
  return (
    <div className="categorias" role="radiogroup" aria-label={titulo}>
      {opcoes.map((c) => {
        const ativa = selecionada === c.id
        return (
          <button
            key={c.id ?? 'todas'}
            type="button"
            role="radio"
            aria-checked={ativa}
            className={`categoria${ativa ? ' categoria--ativa' : ''}`}
            onClick={() => aoEscolher(c.id)}
          >
            {ativa && <Circulado className="categoria-circulo" />}
            <IconeCategoria nome={c.icone} className="categoria-icone" />
            <span>{c.nome}</span>
          </button>
        )
      })}
    </div>
  )
}

// Contador + linha de progresso desenhada à mão
export const Progresso = forwardRef(function Progresso({ abertos, total, restantes, nomeCategoria, textoTodos }, ref) {
  const coracaoRef = useRef(null)
  const fracao = total ? abertos / total : 0

  useImperativeHandle(ref, () => ({
    alvo() {
      const r = coracaoRef.current.getBoundingClientRect()
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
    },
    pulsar() {
      gsap.fromTo(
        coracaoRef.current,
        { scale: 1 },
        { keyframes: { scale: [1, 1.55, 0.9, 1.1, 1] }, duration: 0.7, ease: 'none' },
      )
    },
  }))

  const palavra = restantes === 1 ? 'bilhetinho' : 'bilhetinhos'
  const mensagem =
    restantes === 0 ? (
      <Texto>{textoTodos}</Texto>
    ) : (
      <>
        <strong>{restantes}</strong> {palavra}
        {nomeCategoria ? ` de ${nomeCategoria}` : ''} esperando por você
      </>
    )

  return (
    <div className="progresso">
      <p className="progresso-texto" aria-live="polite">
        {mensagem}
      </p>
      <div className="progresso-fila">
        <div
          className="progresso-linha"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={abertos}
          aria-label={`${abertos} de ${total} bilhetinhos abertos`}
        >
          <svg viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true">
            <path className="progresso-trilho" pathLength="100" d="M2 7c30-2.6 64-3.4 98-2.4 34 1 64 2.5 98 1.4" />
            <path
              className="progresso-cheio"
              pathLength="100"
              style={{ strokeDashoffset: 100 - fracao * 100 }}
              d="M2 7c30-2.6 64-3.4 98-2.4 34 1 64 2.5 98 1.4"
            />
          </svg>
          <span className="progresso-coracao" ref={coracaoRef} style={{ left: `${fracao * 100}%` }}>
            <CoracaoCheio />
          </span>
        </div>
        <span className="progresso-conta" aria-hidden="true">
          {abertos}/{total}
        </span>
      </div>
    </div>
  )
})

export function BotaoMusica({ ligada, alternar }) {
  return (
    <button
      type="button"
      className={`botao-musica${ligada ? ' botao-musica--ligada' : ''}`}
      onClick={alternar}
      aria-pressed={ligada}
      aria-label={ligada ? 'desligar música' : 'ligar música'}
    >
      <Music aria-hidden="true" strokeWidth={1.8} />
      <span className="botao-musica-ondas" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
    </button>
  )
}

export function LinkDica({ texto, aoAbrir }) {
  return (
    <button type="button" className="link-dica" onClick={aoAbrir}>
      <Smartphone aria-hidden="true" strokeWidth={1.8} />
      <span>{texto}</span>
    </button>
  )
}

