import { useEffect, useRef } from 'react'

import '../AboutHero/AboutHero.css'

const MORSE = [
  '.-',
  '-...',
  '-.-.',
  '-..',
  '.',
  '..-.',
  '--.',
  '....',
  '..',
  '.---',
  '-.-',
  '.-..',
  '--',
  '-.',
  '---',
  '.--.',
  '--.-',
  '.-.',
  '...',
  '-',
  '..-',
  '...-',
  '.--',
  '-..-',
  '-.--',
  '--..',
]

const CONFIG = {
  rowGap: 11,
  groupGap: 20,
  symbolGap: 7,
  dotSize: 1.15,
  dashLength: 8,
  dashHeight: 1.4,
  mouseRadius: 240,
  mouseForce: 1.1,
  returnForce: 0.018,
  friction: 0.91,
  baseOpacity: 0.07,
  activeOpacity: 0.78,
}

function random(min, max) {
  return Math.random() * (max - min) + min
}

function randomMorse() {
  return MORSE[Math.floor(Math.random() * MORSE.length)]
}

function createSymbol(type, x, y) {
  return {
    type,

    x,
    y,

    homeX: x,
    homeY: y,

    vx: 0,
    vy: 0,

    size: type === 'dot' ? random(0.7, 1.2) : 1,

    length: type === 'dash' ? random(6, CONFIG.dashLength) : 0,

    opacity: random(0.65, 1),
  }
}

function NoiseField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) return

    const ctx = canvas.getContext('2d', {
      alpha: true,
    })

    if (!ctx) return

    const staticCanvas = document.createElement('canvas')

    const staticCtx = staticCanvas.getContext('2d', {
      alpha: true,
    })

    let width = 0
    let height = 0

    let dpr = 1

    let animationFrame = null

    let running = true

    let mouseActive = false

    const mouse = {
      x: -10000,
      y: -10000,
    }

    const symbols = []

    function createField() {
      symbols.length = 0

      const rows = Math.ceil(height / CONFIG.rowGap) + 4

      const startY = -20

      for (let row = 0; row < rows; row++) {
        let x = random(-80, 0)

        const y = startY + row * CONFIG.rowGap

        while (x < width + 40) {
          const morse = randomMorse()

          for (let i = 0; i < morse.length; i++) {
            const char = morse[i]

            if (char === '.') {
              symbols.push(createSymbol('dot', x, y))

              x += CONFIG.dotSize + CONFIG.symbolGap
            } else {
              symbols.push(createSymbol('dash', x, y))

              x += CONFIG.dashLength + CONFIG.symbolGap
            }
          }

          x += CONFIG.groupGap + random(-2, 5)
        }
      }
    }

    function drawStaticLayer() {
      staticCtx.clearRect(0, 0, width, height)

      for (let i = 0; i < symbols.length; i++) {
        const symbol = symbols[i]

        const opacity = CONFIG.baseOpacity * symbol.opacity

        staticCtx.fillStyle = `rgba(
                        225,
                        228,
                        224,
                        ${opacity}
                    )`

        if (symbol.type === 'dot') {
          staticCtx.beginPath()

          staticCtx.arc(symbol.homeX, symbol.homeY, symbol.size, 0, Math.PI * 2)

          staticCtx.fill()
        } else {
          staticCtx.fillRect(
            symbol.homeX,
            symbol.homeY - CONFIG.dashHeight / 2,
            symbol.length,
            CONFIG.dashHeight,
          )
        }
      }
    }

    function resize() {
      const rect = canvas.parentElement?.getBoundingClientRect()

      if (!rect) return

      width = rect.width
      height = rect.height

      dpr = Math.min(window.devicePixelRatio || 1, 1.5)

      canvas.width = Math.round(width * dpr)

      canvas.height = Math.round(height * dpr)

      staticCanvas.width = Math.round(width * dpr)

      staticCanvas.height = Math.round(height * dpr)

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      staticCtx.setTransform(dpr, 0, 0, dpr, 0, 0)

      createField()

      drawStaticLayer()

      ctx.clearRect(0, 0, width, height)

      ctx.drawImage(staticCanvas, 0, 0, width, height)
    }

    function updateActiveSymbols() {
      if (!mouseActive) {
        return
      }

      const radius = CONFIG.mouseRadius

      const radiusSquared = radius * radius

      for (let i = 0; i < symbols.length; i++) {
        const symbol = symbols[i]

        const dx = symbol.x - mouse.x

        const dy = symbol.y - mouse.y

        const distanceSquared = dx * dx + dy * dy

        if (distanceSquared > radiusSquared) {
          continue
        }

        const distance = Math.sqrt(distanceSquared)

        const influence = 1 - distance / radius

        const safeDistance = Math.max(distance, 1)

        const force = influence * influence * CONFIG.mouseForce

        symbol.vx += (dx / safeDistance) * force

        symbol.vy += (dy / safeDistance) * force

        symbol.vx += (symbol.homeX - symbol.x) * CONFIG.returnForce

        symbol.vy += (symbol.homeY - symbol.y) * CONFIG.returnForce

        symbol.vx *= CONFIG.friction

        symbol.vy *= CONFIG.friction

        symbol.x += symbol.vx

        symbol.y += symbol.vy
      }
    }

    function drawActiveLayer() {
      ctx.clearRect(0, 0, width, height)

      ctx.drawImage(staticCanvas, 0, 0, width, height)

      if (!mouseActive) {
        return
      }

      const radius = CONFIG.mouseRadius

      const radiusSquared = radius * radius

      for (let i = 0; i < symbols.length; i++) {
        const symbol = symbols[i]

        const dx = symbol.x - mouse.x

        const dy = symbol.y - mouse.y

        const distanceSquared = dx * dx + dy * dy

        if (distanceSquared > radiusSquared) {
          continue
        }

        const distance = Math.sqrt(distanceSquared)

        const influence = 1 - distance / radius

        const opacity = Math.min(0.95, CONFIG.baseOpacity + influence * CONFIG.activeOpacity)

        ctx.fillStyle = `rgba(
                        225,
                        228,
                        224,
                        ${opacity}
                    )`

        if (symbol.type === 'dot') {
          ctx.beginPath()

          ctx.arc(symbol.x, symbol.y, symbol.size + influence * 0.4, 0, Math.PI * 2)

          ctx.fill()
        } else {
          ctx.fillRect(symbol.x, symbol.y - CONFIG.dashHeight / 2, symbol.length, CONFIG.dashHeight)
        }
      }
    }

    function render() {
      if (!running) {
        return
      }

      if (mouseActive) {
        updateActiveSymbols()

        drawActiveLayer()

        animationFrame = requestAnimationFrame(render)
      } else {
        animationFrame = null
      }
    }

    function handleMouseMove(event) {
      const rect = canvas.getBoundingClientRect()

      mouse.x = event.clientX - rect.left

      mouse.y = event.clientY - rect.top

      mouseActive = true

      if (!animationFrame) {
        render()
      }
    }

    function handleMouseLeave() {
      mouseActive = false

      mouse.x = -10000
      mouse.y = -10000

      let returnFrame

      function returnAnimation() {
        let moving = false

        for (let i = 0; i < symbols.length; i++) {
          const symbol = symbols[i]

          const dx = symbol.homeX - symbol.x

          const dy = symbol.homeY - symbol.y

          if (
            Math.abs(dx) > 0.1 ||
            Math.abs(dy) > 0.1 ||
            Math.abs(symbol.vx) > 0.05 ||
            Math.abs(symbol.vy) > 0.05
          ) {
            moving = true

            symbol.vx += dx * CONFIG.returnForce

            symbol.vy += dy * CONFIG.returnForce

            symbol.vx *= CONFIG.friction

            symbol.vy *= CONFIG.friction

            symbol.x += symbol.vx

            symbol.y += symbol.vy
          }
        }

        drawActiveLayer()

        if (moving) {
          returnFrame = requestAnimationFrame(returnAnimation)
        } else {
          ctx.clearRect(0, 0, width, height)

          ctx.drawImage(staticCanvas, 0, 0, width, height)
        }
      }

      returnAnimation()
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    document.addEventListener('mouseleave', handleMouseLeave)

    window.addEventListener('resize', resize)

    resize()

    return () => {
      running = false

      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }

      window.removeEventListener('mousemove', handleMouseMove)

      document.removeEventListener('mouseleave', handleMouseLeave)

      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="about-noise-field" aria-hidden="true" />
}

export default NoiseField
