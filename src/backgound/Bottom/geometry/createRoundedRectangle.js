import * as THREE from 'three'

export function createRoundedRectangle(width, height, radius) {
  const shape = new THREE.Shape()

  const halfWidth = width / 2
  const halfHeight = height / 2

  shape.moveTo(-halfWidth + radius, -halfHeight)

  shape.lineTo(halfWidth - radius, -halfHeight)

  shape.quadraticCurveTo(halfWidth, -halfHeight, halfWidth, -halfHeight + radius)

  shape.lineTo(halfWidth, halfHeight - radius)

  shape.quadraticCurveTo(halfWidth, halfHeight, halfWidth - radius, halfHeight)

  shape.lineTo(-halfWidth + radius, halfHeight)

  shape.quadraticCurveTo(-halfWidth, halfHeight, -halfWidth, halfHeight - radius)

  shape.lineTo(-halfWidth, -halfHeight + radius)

  shape.quadraticCurveTo(-halfWidth, -halfHeight, -halfWidth + radius, -halfHeight)

  return shape
}
