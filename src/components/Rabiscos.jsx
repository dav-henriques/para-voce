// Pequenos desenhos feitos "à mão" (traços orgânicos, levemente imperfeitos).
// Todos herdam a cor do texto (currentColor) e o tamanho da fonte (1em).

const traco = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function Svg({ children, className = '', viewBox = '0 0 24 24', espessura = 1.8, ...resto }) {
  return (
    <svg
      className={`rabisco ${className}`}
      viewBox={viewBox}
      aria-hidden="true"
      focusable="false"
      strokeWidth={espessura}
      {...resto}
    >
      {children}
    </svg>
  )
}

export function Coracao(props) {
  return (
    <Svg {...props}>
      <path
        {...traco}
        d="M12.3 20.3C9.6 18.5 3.7 14.6 3.1 9.9 2.7 6.7 4.8 4.4 7.6 4.5c2.1.1 3.6 1.6 4.4 3.5.8-2 2.4-3.6 4.7-3.6 2.9 0 4.7 2.5 4.2 5.5-.8 4.5-6.4 8.4-9 10.2-.4.3-.8.2-1.2-.1"
      />
    </Svg>
  )
}

export function CoracaoCheio(props) {
  return (
    <Svg {...props}>
      <path
        fill="currentColor"
        d="M12 20.7c-.5-.3-7.9-4.9-8.9-9.7C2.4 7.5 4.6 4.6 7.6 4.7c2 .1 3.5 1.4 4.4 3.1.9-1.7 2.5-3.1 4.5-3.2 3-.1 5.2 2.7 4.5 6.2-1 4.8-8.4 9.5-9 9.9z"
      />
      <path {...traco} stroke="#fff" strokeOpacity=".55" strokeWidth="1.3" d="M6.6 8.2c.3-.9 1-1.5 1.9-1.6" />
    </Svg>
  )
}

export function Sol(props) {
  return (
    <Svg {...props}>
      <path {...traco} d="M12 8.1c2.3-.1 4 1.7 4 3.9s-1.8 4-4 4c-2.3 0-4-1.8-4-4 0-2.1 1.7-3.8 3.6-3.9" />
      <path
        {...traco}
        d="M12 2.9v2.3M12.1 18.9v2.2M2.9 12.1h2.3M18.8 11.9h2.3M5.6 5.5l1.6 1.7M16.9 16.8l1.6 1.6M5.7 18.4l1.6-1.6M16.8 7.1l1.7-1.6"
      />
    </Svg>
  )
}

export function Carta(props) {
  return (
    <Svg {...props}>
      <path
        {...traco}
        d="M3.7 6.9c5.6-.4 11.2-.4 16.7-.1.4 3.4.4 6.9.1 10.4-5.6.4-11.2.4-16.8.1-.4-3.5-.4-7 0-10.4z"
      />
      <path {...traco} d="M4 7.3c2.6 2.2 5.2 4.1 8.1 5.8 2.8-1.7 5.4-3.7 8-5.9" />
    </Svg>
  )
}

export function Brilho(props) {
  return (
    <Svg {...props}>
      <path
        {...traco}
        d="M11.6 3c.6 4.6 2.3 6.5 7.2 7.2-4.8.8-6.5 2.6-7.2 7.5-.8-4.8-2.6-6.7-7.3-7.4 4.8-.8 6.5-2.6 7.3-7.3z"
      />
      <path
        {...traco}
        d="M19 15.4c.2 1.6.8 2.3 2.3 2.5-1.5.3-2.1.9-2.3 2.5-.3-1.6-.9-2.2-2.4-2.5 1.5-.2 2.1-.9 2.4-2.5z"
      />
    </Svg>
  )
}

export function Estrela(props) {
  return (
    <Svg {...props}>
      <path
        {...traco}
        d="M12 3.3l2.4 5.3 5.8.7-4.3 3.9 1.2 5.8-5.1-2.9-5 3 1.1-5.8-4.4-3.9 5.9-.7 2.5-5.3"
      />
    </Svg>
  )
}

export function Potinho(props) {
  return (
    <Svg {...props}>
      <path
        {...traco}
        d="M8.2 3.9c2.5-.2 5.1-.2 7.6 0M9 4.2v2.4c-2.4 1-3.6 2.6-3.6 5.2v5.8c0 1.7 1 2.7 2.7 2.7h7.8c1.7 0 2.7-1 2.7-2.7v-5.8c0-2.6-1.2-4.2-3.6-5.2V4.2"
      />
      <path
        {...traco}
        strokeWidth="1.5"
        d="M12 16.6c-.3-.2-2.7-1.7-2.9-3.2-.1-1 .6-1.7 1.4-1.7.7 0 1.2.4 1.5 1 .3-.6.8-1 1.5-1 .9 0 1.5.8 1.3 1.7-.3 1.6-2.5 3-2.8 3.2z"
      />
    </Svg>
  )
}

export function SetaCurva(props) {
  return (
    <Svg viewBox="0 0 64 44" espessura={2} {...props}>
      <path {...traco} d="M4 38c11 2.5 23-1 31-8.6 5.4-5.1 8.6-11.6 9.6-19.4" />
      <path {...traco} d="M37.4 13.6c2.6-2.3 5-4.3 7.4-6.6 1.5 2.9 2.7 5.8 3.9 8.8" />
    </Svg>
  )
}

export function Sublinhado(props) {
  return (
    <Svg viewBox="0 0 140 14" preserveAspectRatio="none" espessura={2.2} {...props}>
      <path {...traco} vectorEffect="non-scaling-stroke" d="M3 9.5c22-4.2 52-5.6 84-3.6 19 1.2 33 2.8 50 1.6" />
    </Svg>
  )
}

export function Circulado(props) {
  return (
    <Svg viewBox="0 0 120 44" preserveAspectRatio="none" espessura={1.6} {...props}>
      <path
        {...traco}
        vectorEffect="non-scaling-stroke"
        d="M16 11.5C33 4 89 2 107 11.5c13 7 6.5 20.5-13.5 25.5-22 5.4-60 5-78-1.4C1.5 30.2 4 17.6 21 9.6 31 5 50 3.2 66 3.4"
      />
    </Svg>
  )
}

const icones = { coracao: Coracao, sol: Sol, carta: Carta, brilho: Brilho, estrela: Estrela, potinho: Potinho }

export function IconeCategoria({ nome, ...props }) {
  const Icone = icones[nome] ?? Coracao
  return <Icone {...props} />
}
