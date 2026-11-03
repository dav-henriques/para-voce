import { Fragment } from 'react'
import { CoracaoCheio } from './Rabiscos.jsx'

// Mostra um texto do content.js trocando ♡ por um coraçãozinho desenhado
// e \n por quebra de linha.
export function Texto({ children = '' }) {
  const linhas = String(children).split('\n')
  return linhas.map((linha, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {linha.split('♡').map((trecho, j) => (
        <Fragment key={j}>
          {j > 0 && <CoracaoCheio className="coracao-inline" />}
          {trecho}
        </Fragment>
      ))}
    </Fragment>
  ))
}
