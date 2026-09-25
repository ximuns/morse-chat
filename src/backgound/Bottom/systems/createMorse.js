import * as THREE from 'three'

import { MORSE } from '../config/settings'
import MORSE_PATTERN from '../config/morsePattern'
import { createRoundedRectangle } from '../geometry/createRoundedRectangle'

export function createMorse(morseGroup, height, material) {
  while (morseGroup.children.length) {
    const mesh = morseGroup.children.pop()

    mesh.geometry.dispose()
  }

  const isMobile = window.innerWidth <= 650

  const topHeightRatio = isMobile ? 0.38 : 0.42

  const topStartY = height * (1 - topHeightRatio)

  const availableHeight = topStartY - MORSE.topOffset

  const baseLength = MORSE_PATTERN.reduce((total, symbol) => {
    const symbolHeight = symbol === '.' ? MORSE.dotSize : MORSE.lineHeight

    return total + symbolHeight + MORSE.symbolGap
  }, 0)

  const scale = Math.min(1, Math.max(0.01, availableHeight / baseLength))

  const dotSize = MORSE.dotSize * scale

  const lineWidth = MORSE.lineWidth * scale

  const lineHeight = MORSE.lineHeight * scale

  const symbolGap = MORSE.symbolGap * scale

  let currentY = height / 2 - MORSE.topOffset

  MORSE_PATTERN.forEach((symbol) => {
    const symbolHeight = symbol === '.' ? dotSize : lineHeight

    let geometry

    if (symbol === '.') {
      geometry = new THREE.CircleGeometry(dotSize / 2, 16)
    } else {
      const shape = createRoundedRectangle(lineWidth, lineHeight, lineWidth / 2)

      geometry = new THREE.ShapeGeometry(shape)
    }

    const mesh = new THREE.Mesh(geometry, material)

    mesh.position.set(0, currentY - symbolHeight / 2, 0)

    morseGroup.add(mesh)

    currentY -= symbolHeight + symbolGap
  })
}
