// Gera os ícones do app (tela de início do iPhone, Android, favicon) e as
// telas de abertura do iPhone, a partir de desenhos SVG feitos aqui mesmo.
//   npm run icones
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const raiz = fileURLToPath(new URL('..', import.meta.url))
const pub = (p) => `${raiz}public/${p}`

const VINHO = '#8F2638'
const CEREJA = '#B83B4B'
const SUAVE = '#D96B72'
const ROSA = '#F2C6BC'
const CREME = '#FFF5EA'

const CORPO =
  'M112 88C111 94 111 99 110 104C108 122 64 126 56 156C50 210 49 290 54 330C56 351 74 358 100 359C140 361 182 361 220 359C246 358 264 351 266 330C271 290 270 210 264 156C256 126 212 122 210 104C209 99 209 94 208 88'
const INTERIOR =
  'M116 100C114 124 72 132 64 160C58 212 57 290 61 328C63 345 78 350 100 351L220 351C242 350 257 345 259 328C263 290 262 212 256 160C248 132 206 124 204 100Z'
const ARO =
  'M104 75.5C134 70.5 186 70.5 216 75.5C221.5 77.5 221.5 88 216 90.5C186 94.5 134 94.5 104 90.5C98.5 88 98.5 77.5 104 75.5Z'
const CORACAO = 'M0 15C-.8 14.4-15.2 5.8-15.8-3.6-16.2-9.2-12-13-7.4-12.8c3.2.2 6 2.4 7.4 5.2 1.4-2.8 4.2-5 7.4-5.2 4.6-.2 8.6 3.6 8.2 9.2C15.2 5.8.8 14.4 0 15z'

// bilhetinhos grandes, para ler bem num ícone pequeno (sempre a mesma pilha)
const PILHA = (() => {
  let semente = 11
  const r = () => ((semente = (semente * 16807) % 2147483647) / 2147483647)
  const cores = [CREME, ROSA, SUAVE, VINHO, CEREJA, CREME, ROSA]
  const itens = []
  for (let y = 342; y >= 196; y -= 27) {
    for (let x = 70 + r() * 18; x <= 258; x += 34 + r() * 10) {
      const topo = 204 + Math.sin(x * 0.05) * 8
      if (y < topo) continue
      itens.push([r() < 0.45 ? 'c' : 'd', x, y + (r() - 0.5) * 6, (r() - 0.5) * 56, 0.92 + r() * 0.3, cores[Math.floor(r() * cores.length)]])
    }
  }
  return itens
})()

function pilha(contorno) {
  return PILHA.map(([tipo, x, y, r, s, cor]) => {
    const linha = cor === VINHO && contorno === VINHO ? CREME : contorno
    const t = `translate(${x} ${y}) rotate(${r}) scale(${s})`
    if (tipo === 'c') return `<path transform="${t}" d="${CORACAO}" fill="${cor}" stroke="${linha}" stroke-width="2.4" stroke-linejoin="round"/>`
    return `<g transform="${t}"><path d="M-24-15 23-16 24 15-23 16z" fill="${cor}" stroke="${linha}" stroke-width="2.4" stroke-linejoin="round"/><path d="M0-15.5 23-16 24 15 .6 15.5z" fill="#000" fill-opacity=".1"/></g>`
  }).join('')
}

// o potinho, em coordenadas 320×400
function pote({ claro }) {
  const tinta = claro ? VINHO : CREME
  return `
  <path d="${CORPO}Z" fill="${claro ? '#fff' : CREME}" fill-opacity="${claro ? 0.32 : 0.16}"/>
  <g clip-path="url(#dentro)">${pilha(claro ? VINHO : VINHO)}</g>
  <g fill="none" stroke="#fff" stroke-linecap="round" stroke-opacity="${claro ? 0.8 : 0.55}">
    <path d="M74 186C67 224 67 270 73 314" stroke-width="9"/>
    <path d="M96 132C88 138 81 145 77 154" stroke-width="6"/>
  </g>
  <path d="${CORPO}" fill="none" stroke="${tinta}" stroke-width="${claro ? 4 : 9}" stroke-linecap="round" stroke-linejoin="round" filter="url(#r)"/>
  <g filter="url(#r)">
    <path d="M117 46C118 58 119 69 121 80.5C146 85.5 174 85.5 199 80.5C201 69 202 58 203 46Z" fill="#DDB088" stroke="${tinta}" stroke-width="${claro ? 3 : 6}" stroke-linejoin="round"/>
    <ellipse cx="160" cy="46" rx="43" ry="9.2" fill="#F0D4B2" stroke="${tinta}" stroke-width="${claro ? 3 : 6}"/>
    <path d="${ARO}" fill="${claro ? '#fff' : CREME}" fill-opacity="${claro ? 0.6 : 0.25}" stroke="${tinta}" stroke-width="${claro ? 3.2 : 7}"/>
    <path d="M110 93.5C140 98.5 180 98.5 210 93.5L210.5 102.5C180 107.5 140 107.5 109.5 102.5Z" fill="${claro ? CEREJA : ROSA}" stroke="${claro ? VINHO : CREME}" stroke-width="${claro ? 2 : 4}"/>
    <path d="M182 99C168 84 146 82 144 94.5 143 106.5 164 108 182 99Z" fill="${claro ? CEREJA : ROSA}" stroke="${claro ? VINHO : CREME}" stroke-width="${claro ? 2.2 : 4.5}" stroke-linejoin="round"/>
    <path d="M182 99C196 83 220 85 219 98 218 109.5 198 108 182 99Z" fill="${claro ? CEREJA : ROSA}" stroke="${claro ? VINHO : CREME}" stroke-width="${claro ? 2.2 : 4.5}" stroke-linejoin="round"/>
    <ellipse cx="182" cy="99.5" rx="7" ry="8" fill="${claro ? '#A82F40' : '#E8A9A3'}" stroke="${claro ? VINHO : CREME}" stroke-width="${claro ? 2.2 : 4.5}"/>
  </g>`
}

const defs = (freq = 0.03, escala = 3) => `
  <clipPath id="dentro"><path d="${INTERIOR}"/></clipPath>
  <filter id="r" x="-5%" y="-5%" width="110%" height="110%">
    <feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="2" seed="4"/>
    <feDisplacementMap in="SourceGraphic" scale="${escala}" xChannelSelector="R" yChannelSelector="G"/>
  </filter>`

function icone({ arredondado = false } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    ${defs()}
    <radialGradient id="fundo" cx="50%" cy="36%" r="78%">
      <stop offset="0" stop-color="#C64B5C"/><stop offset=".55" stop-color="${CEREJA}"/><stop offset="1" stop-color="${VINHO}"/>
    </radialGradient>
    <filter id="grao"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 .95 0 0 0 0 .92 0 0 0 .5 -.18"/></filter>
  </defs>
  <rect width="512" height="512" ${arredondado ? 'rx="116"' : ''} fill="url(#fundo)"/>
  <rect width="512" height="512" ${arredondado ? 'rx="116"' : ''} filter="url(#grao)" opacity=".35"/>
  <ellipse cx="256" cy="430" rx="118" ry="13" fill="${VINHO}" opacity=".55"/>
  <g transform="translate(104 78) scale(.95)">${pote({ claro: false })}</g>
</svg>`
}

function splash(w, h) {
  const largura = w * 0.42
  const escala = largura / 320
  const x = (w - largura) / 2
  const y = h * 0.42 - (400 * escala) / 2
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    ${defs()}
    <radialGradient id="v" cx="50%" cy="42%" r="80%">
      <stop offset=".55" stop-color="${SUAVE}" stop-opacity="0"/><stop offset="1" stop-color="${SUAVE}" stop-opacity=".14"/>
    </radialGradient>
    <radialGradient id="s"><stop offset="0" stop-color="${VINHO}" stop-opacity=".28"/><stop offset="1" stop-color="${VINHO}" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="${CREME}"/>
  <rect width="${w}" height="${h}" fill="url(#v)"/>
  <ellipse cx="${w / 2}" cy="${y + 362 * escala}" rx="${115 * escala}" ry="${12 * escala}" fill="url(#s)"/>
  <g transform="translate(${x} ${y}) scale(${escala})">${pote({ claro: true })}</g>
</svg>`
}

// telas de abertura: [largura css, altura css, densidade]
const TELAS = [
  [440, 956, 3], // iPhone 16/17 Pro Max
  [402, 874, 3], // iPhone 16/17 Pro, 17
  [420, 912, 3], // iPhone Air
  [430, 932, 3], // iPhone 14 Pro Max, 15/16 Plus, 15 Pro Max
  [393, 852, 3], // iPhone 14 Pro, 15, 15 Pro, 16
  [428, 926, 3], // iPhone 12/13 Pro Max, 14 Plus
  [390, 844, 3], // iPhone 12, 13, 14
  [375, 812, 3], // iPhone X, XS, 11 Pro, 12/13 mini
  [414, 896, 3], // iPhone XS Max, 11 Pro Max
  [414, 896, 2], // iPhone XR, 11
  [414, 736, 3], // iPhone 8 Plus
  [375, 667, 2], // iPhone SE, 8
]

async function png(svg, arquivo, tamanho) {
  let img = sharp(Buffer.from(svg), { density: 144 })
  if (tamanho) img = img.resize(tamanho, tamanho)
  await img.flatten({ background: CREME }).png({ compressionLevel: 9, palette: true, quality: 92 }).toFile(pub(arquivo))
  console.log('  ✓', arquivo)
}

await mkdir(pub('icons'), { recursive: true })
await mkdir(pub('splash'), { recursive: true })

console.log('ícones:')
const quadrado = icone()
await png(quadrado, 'apple-touch-icon.png', 180)
await png(quadrado, 'icons/pwa-192.png', 192)
await png(quadrado, 'icons/pwa-512.png', 512)
await png(quadrado, 'icons/maskable-512.png', 512)
await png(icone({ arredondado: true }), 'icons/favicon-32.png', 32)
await writeFile(pub('favicon.svg'), icone({ arredondado: true }))
console.log('  ✓ favicon.svg')

console.log('telas de abertura:')
const links = []
for (const [cw, ch, d] of TELAS) {
  const w = cw * d
  const h = ch * d
  const nome = `splash/splash-${w}x${h}.png`
  await sharp(Buffer.from(splash(w, h))).png({ compressionLevel: 9, palette: true, quality: 95 }).toFile(pub(nome))
  console.log('  ✓', nome)
  links.push(
    `    <link rel="apple-touch-startup-image" media="screen and (device-width: ${cw}px) and (device-height: ${ch}px) and (-webkit-device-pixel-ratio: ${d}) and (orientation: portrait)" href="/${nome}" />`,
  )
}

// escreve as tags no index.html (entre os marcadores)
const html = await readFile(`${raiz}index.html`, 'utf8')
const bloco = `<!--SPLASH:INICIO-->\n${links.join('\n')}\n    <!--SPLASH:FIM-->`
const novo = html.includes('<!--SPLASH:INICIO-->')
  ? html.replace(/<!--SPLASH:INICIO-->[\s\S]*?<!--SPLASH:FIM-->/, bloco)
  : html.replace('<!--SPLASH-->', bloco)
await writeFile(`${raiz}index.html`, novo)
console.log('index.html atualizado ♡')
