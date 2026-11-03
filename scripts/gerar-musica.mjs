// Gera uma melodia ORIGINAL de caixinha de música, em loop perfeito,
// e salva em public/musica/caixinha.mp3.
//   npm run musica
// (Se quiser usar a música de vocês, é só trocar o caminho no content.js.)
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'

// o "main" do lamejs tem um bug conhecido; o pacote pronto (lame.all.js) funciona
const require = createRequire(import.meta.url)
const contexto = { console }
vm.runInNewContext(await readFile(require.resolve('lamejs/lame.all.js'), 'utf8'), contexto)
const { lamejs } = contexto

const SR = 32000
const BPM = 70
const TEMPO = 60 / BPM

// valsa em dó maior, 16 compassos de 3 tempos — [nota midi, duração em tempos]
const MELODIA = [
  [[79, 2], [76, 1]],
  [[81, 1], [79, 1], [76, 1]],
  [[77, 1.5], [76, 0.5], [74, 1]],
  [[74, 2], [71, 1]],
  [[72, 1], [76, 1], [79, 1]],
  [[83, 2], [79, 1]],
  [[81, 1], [84, 1], [81, 1]],
  [[79, 3]],
  [[76, 1], [81, 1], [84, 1]],
  [[84, 1.5], [83, 0.5], [81, 1]],
  [[79, 1], [76, 1], [72, 1]],
  [[74, 2], [79, 1]],
  [[81, 1.5], [79, 0.5], [77, 1]],
  [[76, 1], [74, 1], [71, 1]],
  [[72, 1], [76, 1], [79, 1]],
  [[76, 1], [72, 2]],
]
// acordes (baixo, terça, quinta)
const C = [48, 64, 67]
const Am = [45, 60, 64]
const F = [41, 57, 60]
const G = [43, 59, 62]
const Em = [40, 59, 64]
const ACORDES = [C, Am, F, G, C, Em, F, G, Am, F, C, G, F, G, C, C]

const compassos = MELODIA.length
const duracao = compassos * 3 * TEMPO
const cauda = 4
const total = Math.ceil((duracao + cauda) * SR)
const buf = new Float32Array(total)

let s = 3
const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647)
const freq = (m) => 440 * 2 ** ((m - 69) / 12)

// uma "lâmina" de caixinha de música: tom puro + harmônicos metálicos que somem rápido
function tocar(midi, inicio, vel) {
  const f = freq(midi)
  const decai = 1.9 * Math.sqrt(440 / f)
  const parciais = [
    [1, 1, decai],
    [2, 0.24, decai * 0.45],
    [3, 0.07, decai * 0.25],
    [5.43, 0.05, decai * 0.12],
    [8.9, 0.025, decai * 0.06],
  ]
  const i0 = Math.floor((inicio + (rnd() - 0.5) * 0.012) * SR)
  const n = Math.min(total - i0, Math.floor(decai * 6 * SR))
  const fases = parciais.map(() => rnd() * Math.PI * 2)
  for (let i = 0; i < n; i++) {
    const t = i / SR
    const ataque = Math.min(1, t / 0.002)
    let v = 0
    for (let p = 0; p < parciais.length; p++) {
      const [mult, amp, tau] = parciais[p]
      v += amp * Math.exp(-t / tau) * Math.sin(2 * Math.PI * f * mult * t + fases[p])
    }
    buf[i0 + i] += v * vel * ataque
  }
}

for (let c = 0; c < compassos; c++) {
  const t0 = c * 3 * TEMPO
  let pos = 0
  for (const [nota, dur] of MELODIA[c]) {
    tocar(nota, t0 + pos * TEMPO, 0.78 + rnd() * 0.12)
    pos += dur
  }
  const [baixo, terca, quinta] = ACORDES[c]
  tocar(baixo + 12, t0, 0.42)
  tocar(terca, t0 + TEMPO, 0.26)
  tocar(quinta, t0 + 2 * TEMPO, 0.26)
  if (c % 4 === 3) tocar(quinta + 12, t0 + 2.5 * TEMPO, 0.16)
}

// reverb simples (pentes + passa-tudo), pra soar como uma salinha aconchegante
function reverb(entrada) {
  const saida = new Float32Array(entrada.length)
  const pentes = [1557, 1617, 1491, 1422].map((d) => Math.round((d * SR) / 44100))
  for (const d of pentes) {
    const linha = new Float32Array(d)
    let idx = 0
    let filtro = 0
    for (let i = 0; i < entrada.length; i++) {
      const y = linha[idx]
      filtro = y * 0.7 + filtro * 0.3
      linha[idx] = entrada[i] + filtro * 0.8
      saida[i] += y / pentes.length
      idx = (idx + 1) % d
    }
  }
  for (const d of [225, 556].map((x) => Math.round((x * SR) / 44100))) {
    const linha = new Float32Array(d)
    let idx = 0
    for (let i = 0; i < saida.length; i++) {
      const b = linha[idx]
      const x = saida[i]
      const y = -x + b
      linha[idx] = x + b * 0.5
      saida[i] = y
      idx = (idx + 1) % d
    }
  }
  return saida
}

const molhado = reverb(buf)
const mix = new Float32Array(total)
for (let i = 0; i < total; i++) mix[i] = buf[i] * 0.82 + molhado[i] * 0.34

// loop sem emenda: a cauda do fim volta para o começo
const n = Math.round(duracao * SR)
const loop = mix.slice(0, n)
for (let i = n; i < total; i++) loop[i - n] += mix[i]

// volume suave (no iPhone não dá pra baixar o volume pelo site)
let pico = 0
for (const v of loop) pico = Math.max(pico, Math.abs(v))
const ganho = 0.42 / pico
const pcm = new Int16Array(n)
for (let i = 0; i < n; i++) pcm[i] = Math.max(-1, Math.min(1, loop[i] * ganho)) * 32767

const mp3 = new lamejs.Mp3Encoder(1, SR, 96)
const partes = []
for (let i = 0; i < pcm.length; i += 1152) {
  const parte = mp3.encodeBuffer(pcm.subarray(i, i + 1152))
  if (parte.length) partes.push(Buffer.from(parte))
}
partes.push(Buffer.from(mp3.flush()))

const pasta = fileURLToPath(new URL('../public/musica/', import.meta.url))
await mkdir(pasta, { recursive: true })
const arquivo = Buffer.concat(partes)
await writeFile(`${pasta}caixinha.mp3`, arquivo)
console.log(`♪ caixinha.mp3 — ${duracao.toFixed(1)}s, ${(arquivo.length / 1024).toFixed(0)} KB`)
