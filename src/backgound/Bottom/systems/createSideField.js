import * as THREE from 'three'

import { FIELD, PARTICLE_COLORS } from '../config/settings'

import { random } from '../utils/random'

function createSideParticle(group, x, y, row, column, side, progress, fadeProgress, responsive) {
  const seed = random(row, column, side)
  const seed2 = random(row + 700, column + 31, side)
  const seed3 = random(row + 1400, column + 71, side)

  const columnProgress = column / FIELD.maxColumns

  let probability = 1 - Math.pow(columnProgress, 1.7) * 0.78

  if (column >= 5) {
    probability *= 0.82 - (column - 5) * 0.025
  }

  probability *= 0.15 + fadeProgress * 0.85

  if (seed > probability) {
    return
  }

  let jitterX = 0
  let jitterY = 0

  if (column >= 5) {
    const chaos = Math.min(1, (column - 4) / 8)

    jitterX = (seed2 - 0.5) * (2 + chaos * 9) * responsive

    jitterY = (seed3 - 0.5) * (1 + chaos * 5) * responsive
  }

  const size = Math.max(1.25, (FIELD.particleSize - column * 0.075) * responsive)

  const geometry = new THREE.CircleGeometry(size / 2, 10)

  let colorIndex = 0

  if (seed2 < 0.56) {
    colorIndex = 0
  } else if (seed2 < 0.78) {
    colorIndex = 1
  } else if (seed2 < 0.91) {
    colorIndex = 2
  } else if (seed2 < 0.985) {
    colorIndex = 3
  } else {
    colorIndex = 4
  }

  const color = PARTICLE_COLORS[colorIndex]

  let opacity = 0.42

  opacity *= 1 - column * 0.025

  opacity *= 0.68 + progress * 0.32

  if (column >= 5) {
    opacity *= 0.6 + seed3 * 0.4
  }

  if (seed2 > 0.86) {
    opacity *= 0.28
  }

  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    depthWrite: false,
  })

  const particle = new THREE.Mesh(geometry, material)

  particle.position.set(x + jitterX, y + jitterY, -0.02)

  group.add(particle)
}

export function createSideField(group, width, height) {
  while (group.children.length) {
    const mesh = group.children.pop()

    mesh.geometry.dispose()
    mesh.material.dispose()
  }

  const responsive = THREE.MathUtils.clamp(width / 1800, 0.48, 1)

  const fieldHeight = height * FIELD.length

  const particleSize = FIELD.particleSize * responsive

  const particleGap = FIELD.particleGap * responsive

  const firstColumnDistance = FIELD.firstColumnDistance * responsive

  const columnGap = FIELD.columnGap * responsive

  const particleStep = particleSize + particleGap

  const rows = Math.ceil(fieldHeight / particleStep)

  for (let row = 0; row < rows; row++) {
    const y = height / 2 - firstColumnDistance - firstColumnDistance - row * particleStep

    const progress = row / Math.max(rows - 1, 1)

    const fadeProgress = Math.min(1, Math.max(0, (row - FIELD.fadeInRows) / 18))

    const rowSeed = random(row, 999, 0)

    const rowVisibility = 0.2 + fadeProgress * 0.8

    if (rowSeed > rowVisibility) {
      continue
    }

    const expansion = Math.pow(progress, 0.72)

    const columns = Math.min(FIELD.maxColumns, Math.floor(expansion * FIELD.maxColumns))

    for (let column = 0; column < columns; column++) {
      const distance = firstColumnDistance + column * columnGap

      createSideParticle(group, -distance, y, row, column, -1, progress, fadeProgress, responsive)

      createSideParticle(group, distance, y, row, column, 1, progress, fadeProgress, responsive)
    }
  }
}
