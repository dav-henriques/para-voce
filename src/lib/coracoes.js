import confetti from 'canvas-confetti'

const CORES = ['#8F2638', '#B83B4B', '#D96B72', '#F2C6BC', '#E58C8F']
let disparar = null
let formas = null

export function prepararCoracoes(canvas) {
  if (!canvas || disparar) return
  disparar = confetti.create(canvas, { resize: true, useWorker: false })
  formas = [
    confetti.shapeFromPath({
      path: 'M12 21.2C11.4 20.8 3 15.6 2.1 10.4 1.5 6.9 3.8 4.1 7 4.2c2.1.1 3.8 1.5 5 3.4 1.2-1.9 2.9-3.4 5-3.4 3.2-.1 5.4 2.7 4.8 6.2-.9 5.2-9.2 10.4-9.8 10.8z',
    }),
  ]
}

// Uma revoada de coraçõezinhos a partir de um ponto da tela (em px).
export function soltarCoracoes(x, y, { quantidade = 22, forca = 1 } = {}) {
  if (!disparar) return
  const origin = { x: x / window.innerWidth, y: y / window.innerHeight }
  const base = {
    shapes: formas,
    colors: CORES,
    origin,
    gravity: 0.5,
    decay: 0.93,
    ticks: 190,
    disableForReducedMotion: true,
  }
  disparar({ ...base, particleCount: quantidade, spread: 110, startVelocity: 19 * forca, scalar: 1.5 })
  disparar({ ...base, particleCount: Math.round(quantidade / 2), spread: 60, startVelocity: 26 * forca, scalar: 1.05, angle: 90 })
}
