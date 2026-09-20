import * as THREE from 'three'

import {
    PARTICLE_COLORS,
    GLOW,
} from '../config/settings'

export function createHorizonParticles(
    group,
    height
) {
    while (group.children.length) {
        const mesh =
            group.children.pop()

        mesh.geometry.dispose()
        mesh.material.dispose()
    }

    const horizonY =
        -height / 2 +
        height * GLOW.y

    for (
        let index = 0;
        index < 260;
        index++
    ) {
        const seedX =
            Math.sin(
                index * 47.13
            )

        const seedY =
            Math.sin(
                index * 91.73
            )

        const spread =
            20 +
            Math.abs(seedX) *
            220

        const x =
            seedX *
            spread

        const y =
            horizonY +
            Math.abs(seedY) *
            75

        const geometry =
            new THREE.CircleGeometry(
                1,
                8
            )

        const color =
            PARTICLE_COLORS[
                index % 4
            ]

        const material =
            new THREE.MeshBasicMaterial({
                color,

                transparent: true,

                opacity: 0.02,

                depthWrite: false,
            })

        const particle =
            new THREE.Mesh(
                geometry,
                material
            )

        const distance =
            Math.abs(x)

        const centerFactor =
            1 -
            Math.min(
                distance / 250,
                1
            )

        particle.position.set(
            x,
            y,
            -0.03
        )

        particle.scale.setScalar(
            0.3 +
            Math.abs(seedX) *
            0.8
        )

        particle.material.opacity =
            0.012 +
            centerFactor *
            0.07

        group.add(particle)
    }
}