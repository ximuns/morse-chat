import * as THREE from 'three'

import { MORSE } from '../config/settings'

import MORSE_PATTERN from '../config/morsePattern'

import { createRoundedRectangle } from '../geometry/createRoundedRectangle'

export function createMorse(morseGroup, height, material) {
  while (morseGroup.children.length) {
    const mesh = morseGroup.children.pop()

    mesh.geometry.dispose()
  }

  let currentY = height / 2 - MORSE.topOffset

  MORSE_PATTERN.forEach((symbol) => {
    const symbolHeight = symbol === '.' ? MORSE.dotSize : MORSE.lineHeight

    let geometry

    if (symbol === '.') {
      geometry = new THREE.CircleGeometry(MORSE.dotSize / 2, 16)
    } else {
      const shape = createRoundedRectangle(MORSE.lineWidth, MORSE.lineHeight, MORSE.lineWidth / 2)

      geometry = new THREE.ShapeGeometry(shape)
    }

    const mesh = new THREE.Mesh(geometry, material)

    mesh.position.set(0, currentY - symbolHeight / 2, 0)

    morseGroup.add(mesh)

    currentY -= symbolHeight + MORSE.symbolGap
  })
}
