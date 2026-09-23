import * as THREE from 'three'

import { createGlowTexture } from '../geometry/createGlowTexture'
import { GLOW } from '../config/settings'

export function createGlow(glowGroup, width, height) {
  const glowTexture = createGlowTexture()

  const glowMaterial = new THREE.SpriteMaterial({
    map: glowTexture,

    transparent: true,

    opacity: GLOW.opacity,

    depthWrite: false,

    blending: THREE.AdditiveBlending,
  })

  const glow = new THREE.Sprite(glowMaterial)

  glow.scale.set(GLOW.width, GLOW.height, 1)

  glow.position.set(0, -height / 2 + height * GLOW.y, 0)

  glowGroup.add(glow)

  // -----------------------------------------
  // AMBIENT GLOW
  // -----------------------------------------

  const ambientTexture = createGlowTexture()

  const ambientMaterial = new THREE.SpriteMaterial({
    map: ambientTexture,

    transparent: true,

    opacity: GLOW.ambientOpacity,

    depthWrite: false,

    blending: THREE.AdditiveBlending,
  })

  const ambientGlow = new THREE.Sprite(ambientMaterial)

  ambientGlow.scale.set(GLOW.ambientWidth, GLOW.ambientHeight, 1)

  ambientGlow.position.set(0, -height / 2 + height * GLOW.y + GLOW.ambientOffsetY, -0.01)

  glowGroup.add(ambientGlow)

  // -----------------------------------------
  // SOFT GLOW
  // -----------------------------------------

  const softTexture = createGlowTexture()

  const softMaterial = new THREE.SpriteMaterial({
    map: softTexture,

    transparent: true,

    opacity: GLOW.softOpacity,

    depthWrite: false,

    blending: THREE.AdditiveBlending,
  })

  const softGlow = new THREE.Sprite(softMaterial)

  softGlow.scale.set(GLOW.softWidth, GLOW.softHeight, 1)

  softGlow.position.set(0, -height / 2 + height * GLOW.y + GLOW.softOffsetY, 0.01)

  glowGroup.add(softGlow)

  return {
    glow,
    ambientGlow,
    softGlow,
  }
}
