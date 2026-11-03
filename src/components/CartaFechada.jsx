import { forwardRef, useImperativeHandle, useRef } from 'react'
import gsap from 'gsap'
import { Texto } from './Texto.jsx'
import { semMovimento } from '../lib/movimento.js'

const VINHO = '#8F2638'
const CEREJA = '#B83B4B'

// O bilhete especial, amarrado com um lacinho vermelho, encostado no potinho.
export const CartaFechada = forwardRef(function CartaFechada({ titulo, aoAbrir }, ref) {
  const botaoRef = useRef(null)
  const lacoRef = useRef(null)

  useImperativeHandle(ref, () => ({
    rect: () => botaoRef.current.getBoundingClientRect(),
    // quando a carta volta pro lugar, o laço dá uma balançadinha
    reamarrar() {
      if (semMovimento()) return
      gsap.fromTo(
        lacoRef.current,
        { rotation: -10, scale: 1.12, svgOrigin: '134 42' },
        { rotation: 0, scale: 1, svgOrigin: '134 42', duration: 0.7, ease: 'elastic.out(1.1, 0.45)' },
      )
    },
  }))

  return (
    <button type="button" ref={botaoRef} className="carta-fechada" onClick={aoAbrir} aria-label={titulo}>
      <svg viewBox="0 0 170 128" aria-hidden="true" focusable="false">
        <path
          d="M15 22C52 19 121 18 161 21 163 54 163 88 160 116 119 119 55 120 16 117 13 86 13 52 15 22Z"
          fill={VINHO}
          fillOpacity=".13"
        />
        <g filter="url(#rabisco)" strokeLinejoin="round" strokeLinecap="round">
          <path
            d="M11 17C49 14 118 13 158 16 160 49 160 83 157 111 116 114 52 115 13 112 10 81 10 47 11 17Z"
            fill="#FFF8EE"
            stroke={VINHO}
            strokeWidth="2.2"
          />
          <path d="M13 66C58 64 112 64 156 66" fill="none" stroke={VINHO} strokeOpacity=".15" strokeWidth="1.4" />
          <path d="M14 20C40 18 60 18 80 18" fill="none" stroke="#fff" strokeWidth="2" />
          <path
            d="M128 14.5 140 14.2C140.4 47 140.4 80 140 113.2L128.2 113.5C127.6 80 127.6 47 128 14.5Z"
            fill={CEREJA}
            stroke={VINHO}
            strokeWidth="1.5"
          />
        </g>
        <g ref={lacoRef} filter="url(#rabisco)" strokeLinejoin="round" strokeLinecap="round">
          <path d="M131 45C126 60 120 72 113 84L120.5 82.5 123 90C129 76 134 62 137 47Z" fill="#A82F40" stroke={VINHO} strokeWidth="1.6" />
          <path d="M137 45C142 58 149 69 158 79L150.5 80 150 87.5C142 76 137 63 132 48Z" fill={CEREJA} stroke={VINHO} strokeWidth="1.6" />
          <path d="M134 42C121 27 101 26 102 39.5 103 52.5 121 52 134 42Z" fill={CEREJA} stroke={VINHO} strokeWidth="1.8" />
          <path d="M134 42C147 27 168 28 166 41.5 164 54 146 52 134 42Z" fill={CEREJA} stroke={VINHO} strokeWidth="1.8" />
          <path d="M130 40C123 35 113 34 108 37.5M138 40C145 35 155 35 160 38.5" fill="none" stroke={VINHO} strokeOpacity=".5" strokeWidth="1.2" />
          <ellipse cx="134" cy="42.5" rx="6.6" ry="7.6" fill="#A82F40" stroke={VINHO} strokeWidth="1.8" />
        </g>
      </svg>
      <span className="carta-fechada-titulo">
        <Texto>{titulo}</Texto>
      </span>
    </button>
  )
})
