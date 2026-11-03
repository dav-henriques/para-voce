import { forwardRef, memo, useEffect, useImperativeHandle, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { NotaDoPote, notasDoPote } from './notasDoPote.jsx'
import { semMovimento } from '../lib/movimento.js'

const VINHO = '#8F2638'
const CEREJA = '#B83B4B'

// Contorno do vidro (aberto em cima, onde fica o aro)
const CORPO =
  'M112 88C111 94 111 99 110 104C108 122 64 126 56 156C50 210 49 290 54 330C56 351 74 358 100 359C140 361 182 361 220 359C246 358 264 351 266 330C271 290 270 210 264 156C256 126 212 122 210 104C209 99 209 94 208 88'
const CORPO_FECHADO = `${CORPO}Z`
const INTERIOR =
  'M116 100C114 124 72 132 64 160C58 212 57 290 61 328C63 345 78 350 100 351L220 351C242 350 257 345 259 328C263 290 262 212 256 160C248 132 206 124 204 100Z'
const ARO =
  'M104 75.5C134 70.5 186 70.5 216 75.5C221.5 77.5 221.5 88 216 90.5C186 94.5 134 94.5 104 90.5C98.5 88 98.5 77.5 104 75.5Z'

const Desenho = memo(function Desenho({ rolhaRef }) {
  return (
    <svg className="pote-svg" viewBox="36 24 248 346" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="pote-interior">
          <path d={INTERIOR} />
        </clipPath>
        <linearGradient id="pote-vidro" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity=".75" />
          <stop offset=".4" stopColor="#fff" stopOpacity=".28" />
          <stop offset=".82" stopColor="#F2C6BC" stopOpacity=".3" />
          <stop offset="1" stopColor="#D96B72" stopOpacity=".35" />
        </linearGradient>
        <linearGradient id="pote-reflexo" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity=".5" />
          <stop offset=".22" stopColor="#fff" stopOpacity=".08" />
          <stop offset=".78" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity=".22" />
        </linearGradient>
        <linearGradient id="pote-rolha" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#E9C7A0" />
          <stop offset=".55" stopColor="#DDB088" />
          <stop offset="1" stopColor="#C99872" />
        </linearGradient>
      </defs>

      {/* vidro, por trás */}
      <path d={CORPO_FECHADO} fill="url(#pote-vidro)" />
      <path d="M114 104C140 112 180 112 206 104" fill="none" stroke={VINHO} strokeOpacity=".2" strokeWidth="1.6" />

      {/* bilhetinhos lá dentro */}
      <g clipPath="url(#pote-interior)">
        {notasDoPote.map((n, i) => (
          <NotaDoPote key={i} {...n} />
        ))}
      </g>

      {/* vidro, na frente */}
      <path d={CORPO_FECHADO} fill="url(#pote-reflexo)" />
      <g fill="none" stroke={VINHO} strokeOpacity=".26" strokeWidth="1.4" strokeLinecap="round">
        <path d="M253 280l9-6.5M251 293l11-8M248 306l12-8.8M244 320l12.5-9M238 333l12-8.6M229 343l10-7" />
        <path d="M76 347.5C120 354 200 354 244 347.5" strokeOpacity=".3" />
      </g>
      <g fill="none" stroke="#fff" strokeLinecap="round">
        <path d="M73 184C66 222 66 272 72 316" strokeWidth="7" strokeOpacity=".75" />
        <path d="M75 329.5l1.6 6" strokeWidth="5" strokeOpacity=".7" />
        <path d="M95 131C86 137 79 144 75 153" strokeWidth="4.5" strokeOpacity=".7" />
        <path d="M251 198C255 232 255 268 251 298" strokeWidth="2.6" strokeOpacity=".55" />
      </g>

      {/* contorno à mão */}
      <g filter="url(#rabisco)" fill="none" stroke={VINHO} strokeLinecap="round" strokeLinejoin="round">
        <path d={CORPO} strokeWidth="3.3" />
        <path d={CORPO} strokeWidth="1.1" strokeOpacity=".35" transform="translate(1.6 -1.1)" />
      </g>

      {/* rolha */}
      <g ref={rolhaRef} className="pote-rolha" filter="url(#rabisco)">
        <path d="M117 46C118 58 119 69 121 80.5C146 85.5 174 85.5 199 80.5C201 69 202 58 203 46Z" fill="url(#pote-rolha)" />
        <g fill="#A97654" fillOpacity=".55">
          <circle cx="131" cy="62" r="1.3" />
          <circle cx="145" cy="72" r="1.1" />
          <circle cx="158" cy="64" r="1.4" />
          <circle cx="174" cy="74" r="1.1" />
          <circle cx="186" cy="60" r="1.3" />
          <circle cx="137" cy="76" r="1" />
          <circle cx="193" cy="72" r=".9" />
          <circle cx="166" cy="57" r=".9" />
        </g>
        <ellipse cx="160" cy="46" rx="43" ry="9.2" fill="#F0D4B2" />
        <path d="M128 44.5c6-3.3 16-4.6 25-4.6" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="2" strokeLinecap="round" />
        <g fill="none" stroke={VINHO} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M117 46C118 58 119 69 121 80.5C146 85.5 174 85.5 199 80.5C201 69 202 58 203 46" />
          <path d="M117 46C117 39.5 140 36.5 160 36.8 182 37 203 39.8 203 46.2 202.6 52 182 55.3 160 55.3 138 55.2 117.4 52 117 46" />
        </g>
      </g>

      {/* aro do vidro */}
      <path d={ARO} fill="url(#pote-vidro)" fillOpacity=".9" />
      <path d="M110 79.5c10-1.6 22-2.1 34-2.1" fill="none" stroke="#fff" strokeOpacity=".85" strokeWidth="2.6" strokeLinecap="round" />
      <path d={ARO} fill="none" stroke={VINHO} strokeWidth="2.8" strokeLinejoin="round" filter="url(#rabisco)" />

      {/* fita e lacinho */}
      <g filter="url(#rabisco)" strokeLinejoin="round" strokeLinecap="round">
        <path d="M110 93.5C140 98.5 180 98.5 210 93.5L210.5 102.5C180 107.5 140 107.5 109.5 102.5Z" fill={CEREJA} stroke={VINHO} strokeWidth="1.8" />
        <path d="M186 103C190 115 196 124 204 133L197.5 133.5 197 140C189 129 184 117 181 105Z" fill={CEREJA} stroke={VINHO} strokeWidth="1.8" />
        <path d="M179 103C175 115 170 125 164 135.5L170.5 134 173.5 140C179 128 183 116 184.5 104.5Z" fill="#A82F40" stroke={VINHO} strokeWidth="1.8" />
        <path d="M182 99C170 86 150 84 148 94.5 147 104.5 166 106.5 182 99Z" fill={CEREJA} stroke={VINHO} strokeWidth="1.9" />
        <path d="M182 99C194 85 216.5 86 215 97.5 214 107.5 196 106.5 182 99Z" fill={CEREJA} stroke={VINHO} strokeWidth="1.9" />
        <path d="M178 97C170 92 160 91 155 94.5M186 97C194 92 204 91.5 209 95" fill="none" stroke={VINHO} strokeOpacity=".55" strokeWidth="1.3" />
        <ellipse cx="182" cy="99.5" rx="5.6" ry="6.6" fill="#A82F40" stroke={VINHO} strokeWidth="1.8" />
      </g>

      {/* etiqueta */}
      <path d="M185 104c9 15 23 25 36 38" fill="none" stroke="#625052" strokeWidth="1" strokeOpacity=".8" />
      <g transform="translate(225 150) rotate(14)" filter="url(#rabisco)">
        <path d="M-10-5.5 0-13.5 10-5.5 10 15.5-10 15.5Z" fill="#FFF5EA" stroke={VINHO} strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="0" cy="-6.5" r="1.9" fill="none" stroke={VINHO} strokeWidth="1.3" />
        <path
          d="M0 10.5C-.3 10.3-5.2 7.3-5.4 4.2-5.5 2.4-4.1 1.1-2.6 1.2-1.5 1.3-.5 2-0 3 .5 2 1.4 1.3 2.5 1.2 4 1.1 5.4 2.4 5.2 4.2 5 7.3.3 10.3 0 10.5Z"
          fill={CEREJA}
        />
      </g>
    </svg>
  )
})

// O potinho: flutua devagarinho, balança quando é tocado e
// conta para o palco onde fica a "boca" (de onde sai o bilhete).
export const Pote = forwardRef(function Pote({ aoAbrir, pausado, rotulo }, ref) {
  const raizRef = useRef(null)
  const flutuaRef = useRef(null)
  const balancaRef = useRef(null)
  const sombraRef = useRef(null)
  const rolhaRef = useRef(null)
  const flutuacao = useRef(null)

  useGSAP(
    () => {
      if (semMovimento()) return
      flutuacao.current = gsap
        .timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut', duration: 2.7 } })
        .to(flutuaRef.current, { y: -7, rotation: 0.7 }, 0)
        .to(sombraRef.current, { scaleX: 0.88, opacity: 0.65 }, 0)
    },
    { scope: raizRef },
  )

  useEffect(() => {
    if (!flutuacao.current) return
    if (pausado) flutuacao.current.pause()
    else flutuacao.current.resume()
  }, [pausado])

  useImperativeHandle(ref, () => ({
    // ponto (em px na tela) de onde o bilhete sai
    boca() {
      const r = rolhaRef.current.getBoundingClientRect()
      return { x: r.left + r.width / 2, y: r.top + r.height * 0.75, largura: r.width }
    },
    balancar() {
      const tl = gsap.timeline()
      if (semMovimento()) return tl
      tl.to(balancaRef.current, {
        keyframes: { rotation: [0, -5, 4.2, -2.6, 1.3, 0], easeEach: 'sine.inOut' },
        duration: 0.8,
        transformOrigin: '50% 92%',
      })
        .to(rolhaRef.current, { y: -18, rotation: -13, svgOrigin: '117 80', duration: 0.24, ease: 'power2.out' }, 0.2)
        .to(rolhaRef.current, { y: 0, rotation: 0, duration: 0.5, ease: 'bounce.out' }, 0.82)
      return tl
    },
  }))

  return (
    <div className="pote" ref={raizRef}>
      <div className="pote-sombra" ref={sombraRef} />
      <button type="button" className="pote-botao" onClick={aoAbrir} aria-label={rotulo}>
        <span className="pote-hover">
          <span className="pote-flutua" ref={flutuaRef}>
            <span className="pote-balanca" ref={balancaRef}>
              <Desenho rolhaRef={rolhaRef} />
            </span>
          </span>
        </span>
      </button>
    </div>
  )
})
