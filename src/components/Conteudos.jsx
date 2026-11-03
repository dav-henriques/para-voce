import { Texto } from './Texto.jsx'
import { Coracao, CoracaoCheio, Estrela, IconeCategoria, Sublinhado } from './Rabiscos.jsx'
import { asset } from '../lib/asset.js'
import { tamanhoDoTexto } from '../lib/bilhetes.js'

// Parte de dentro de um bilhetinho (o lado claro do papel)
export function ConteudoBilhete({ bilhete, categoria, assinatura }) {
  return (
    <div className="bilhete" data-tamanho={tamanhoDoTexto(bilhete.texto)}>
      <p className="bilhete-etiqueta" style={{ '--cor': categoria.papel }}>
        <IconeCategoria nome={categoria.icone} />
        {categoria.nome}
      </p>

      {bilhete.foto && (
        <figure className="bilhete-foto">
          <span className="bilhete-fita" />
          <span className="bilhete-foto-moldura">
            <img src={asset(bilhete.foto)} alt={bilhete.legenda ?? ''} draggable={false} decoding="async" />
          </span>
          {bilhete.legenda && (
            <figcaption>
              <Texto>{bilhete.legenda}</Texto>
            </figcaption>
          )}
        </figure>
      )}

      {bilhete.texto && (
        <p className="bilhete-texto">
          <Texto>{bilhete.texto}</Texto>
        </p>
      )}

      {assinatura && (
        <p className="bilhete-assinatura">
          — <Texto>{assinatura}</Texto>
        </p>
      )}

      <svg className="bilhete-moldura" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path
          vectorEffect="non-scaling-stroke"
          d="M2.2 2.6C30 1.6 70 2.1 97.6 2.4 98.3 35 97.9 68 97.5 97.4 66 98.3 34 97.9 2.6 97.6 1.8 66 2.1 34 2.2 2.6Z"
        />
      </svg>
      <Estrela className="bilhete-enfeite bilhete-enfeite--estrela" />
      <Coracao className="bilhete-enfeite bilhete-enfeite--coracao" />
    </div>
  )
}

// Lado de fora do papel: colorido, com uma estampinha discreta
export function VersoBilhete({ cor }) {
  return <div className="verso" style={{ '--cor': cor }} />
}

// Adesivo de coração que mantém o bilhete fechado
export function SeloCoracao({ cor, icone }) {
  return (
    <span className="selo" style={{ '--cor-selo': cor }}>
      <svg viewBox="0 0 48 44" aria-hidden="true">
        <path
          d="M24 40.6C23 40 6.5 30.4 4.6 20.4 3.4 13.6 7.6 8 13.6 8.2c4.3.1 7.5 2.9 10.4 6.6 2.9-3.7 6-6.4 10.3-6.6 6-.2 10.4 5.4 9.1 12.2C41.5 30.4 25 40 24 40.6z"
          fill="var(--cor-selo)"
          stroke="#8F2638"
          strokeWidth="2"
          strokeLinejoin="round"
          filter="url(#rabisco)"
        />
        <path d="M11.5 16.5c.6-2.2 2.2-3.6 4.3-4" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
      {icone && <IconeCategoria nome={icone} className="selo-icone" />}
    </span>
  )
}

// A carta especial, aberta
export function ConteudoCarta({ carta }) {
  return (
    <div className="carta">
      <h2 className="carta-titulo">
        <Texto>{carta.titulo}</Texto>
        <Sublinhado className="carta-sublinhado" />
      </h2>
      <div className="carta-pautado">
        {carta.saudacao && (
          <p className="carta-saudacao">
            <Texto>{carta.saudacao}</Texto>
          </p>
        )}
        {carta.paragrafos.map((p, i) => (
          <p key={i}>
            <Texto>{p}</Texto>
          </p>
        ))}
        {carta.despedida && (
          <p className="carta-despedida">
            <Texto>{carta.despedida}</Texto>
          </p>
        )}
        {carta.assinatura && (
          <p className="carta-assinatura">
            <Texto>{carta.assinatura}</Texto> <CoracaoCheio className="carta-assinatura-coracao" />
          </p>
        )}
      </div>
    </div>
  )
}

export function VersoCarta() {
  return <div className="verso verso--carta" />
}

// O lacinho vermelho que fecha a carta especial dobrada
export function LacoCarta({ titulo }) {
  return (
    <span className="laco-carta">
      <span className="laco-carta-fita" />
      <svg viewBox="70 18 100 80" aria-hidden="true">
        <g filter="url(#rabisco)" strokeLinejoin="round" strokeLinecap="round">
          <path d="M115 45C110 60 104 72 97 84L104.5 82.5 107 90C113 76 118 62 121 47Z" fill="#A82F40" stroke="#8F2638" strokeWidth="1.6" />
          <path d="M121 45C126 58 133 69 142 79L134.5 80 134 87.5C126 76 121 63 116 48Z" fill="#B83B4B" stroke="#8F2638" strokeWidth="1.6" />
          <path d="M118 42C105 27 85 26 86 39.5 87 52.5 105 52 118 42Z" fill="#B83B4B" stroke="#8F2638" strokeWidth="1.8" />
          <path d="M118 42C131 27 152 28 150 41.5 148 54 130 52 118 42Z" fill="#B83B4B" stroke="#8F2638" strokeWidth="1.8" />
          <ellipse cx="118" cy="42.5" rx="6.6" ry="7.6" fill="#A82F40" stroke="#8F2638" strokeWidth="1.8" />
        </g>
      </svg>
      {titulo && (
        <span className="laco-carta-titulo">
          <Texto>{titulo}</Texto>
        </span>
      )}
    </span>
  )
}
