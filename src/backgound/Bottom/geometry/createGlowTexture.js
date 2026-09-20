import * as THREE from 'three'

export function createGlowTexture() {
    const canvas = document.createElement('canvas')

    canvas.width = 1024
    canvas.height = 512

    const context = canvas.getContext('2d')

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    const gradient = context.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        canvas.width * 0.5
    )

    gradient.addColorStop(
        0,
        'rgba(235,240,236,0.42)'
    )

    gradient.addColorStop(
        0.08,
        'rgba(225,231,227,0.30)'
    )

    gradient.addColorStop(
        0.18,
        'rgba(215,222,218,0.18)'
    )

    gradient.addColorStop(
        0.30,
        'rgba(200,208,203,0.09)'
    )

    gradient.addColorStop(
        0.45,
        'rgba(180,190,184,0.035)'
    )

    gradient.addColorStop(
        0.62,
        'rgba(160,170,165,0.012)'
    )

    gradient.addColorStop(
        0.80,
        'rgba(140,150,145,0.003)'
    )

    gradient.addColorStop(
        1,
        'rgba(120,130,125,0)'
    )

    context.fillStyle = gradient

    context.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    )

    const texture = new THREE.CanvasTexture(canvas)

    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.needsUpdate = true

    return texture
}