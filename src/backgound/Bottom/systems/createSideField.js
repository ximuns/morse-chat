import * as THREE from 'three'

import {
    FIELD,
    PARTICLE_COLORS,
} from '../config/settings'

import {
    random,
} from '../utils/random'

function createSideParticle(
    group,
    x,
    y,
    row,
    column,
    side,
    progress,
    fadeProgress
) {
    const seed =
        random(
            row,
            column,
            side
        )

    const seed2 =
        random(
            row + 700,
            column + 31,
            side
        )

    const seed3 =
        random(
            row + 1400,
            column + 71,
            side
        )

    // -----------------------------------------
    // DISTANCE FROM CENTER
    // -----------------------------------------

    const columnProgress =
        column /
        FIELD.maxColumns

    let probability =
        1 -
        Math.pow(
            columnProgress,
            1.7
        ) *
        0.78

    // -----------------------------------------
    // AFTER FIFTH COLUMN
    // -----------------------------------------

    if (column >= 5) {
        probability *=
            0.82 -
            (column - 5) *
            0.025
    }

    // -----------------------------------------
    // TOP FADE
    // -----------------------------------------

    probability *=
        0.15 +
        fadeProgress *
        0.85

    // -----------------------------------------
    // RANDOM DISAPPEAR
    // -----------------------------------------

    if (seed > probability) {
        return
    }

    // -----------------------------------------
    // JITTER
    // -----------------------------------------

    let jitterX = 0
    let jitterY = 0

    if (column >= 5) {
        const chaos =
            Math.min(
                1,
                (column - 4) / 8
            )

        jitterX =
            (seed2 - 0.5) *
            (2 + chaos * 9)

        jitterY =
            (seed3 - 0.5) *
            (1 + chaos * 5)
    }

    // -----------------------------------------
    // SIZE
    // -----------------------------------------

    const size =
        Math.max(
            1.6,
            FIELD.particleSize -
                column * 0.075
        )

    const geometry =
        new THREE.CircleGeometry(
            size / 2,
            10
        )

    // -----------------------------------------
    // COLOR
    // -----------------------------------------

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

    const color =
        PARTICLE_COLORS[colorIndex]

    // -----------------------------------------
    // OPACITY
    // -----------------------------------------

    let opacity = 0.42

    opacity *=
        1 -
        column *
        0.025

    opacity *=
        0.68 +
        progress *
        0.32

    if (column >= 5) {
        opacity *=
            0.60 +
            seed3 *
            0.40
    }

    if (seed2 > 0.86) {
        opacity *= 0.28
    }

    const material =
        new THREE.MeshBasicMaterial({
            color,

            transparent: true,

            opacity,

            depthWrite: false,
        })

    const particle =
        new THREE.Mesh(
            geometry,
            material
        )

    particle.position.set(
        x + jitterX,
        y + jitterY,
        -0.02
    )

    group.add(particle)
}

export function createSideField(
    group,
    width,
    height
) {
    while (group.children.length) {
        const mesh =
            group.children.pop()

        mesh.geometry.dispose()
        mesh.material.dispose()
    }

    const fieldHeight =
        height *
        FIELD.length

    const particleStep =
        FIELD.particleSize +
        FIELD.particleGap

    const rows =
        Math.ceil(
            fieldHeight /
            particleStep
        )

    for (
        let row = 0;
        row < rows;
        row++
    ) {
        const y =
            height / 2 -
            FIELD.firstColumnDistance -
            FIELD.firstColumnDistance -
            row *
            particleStep

        const progress =
            row /
            Math.max(
                rows - 1,
                1
            )

        const fadeProgress =
            Math.min(
                1,
                Math.max(
                    0,
                    (
                        row -
                        FIELD.fadeInRows
                    ) / 18
                )
            )

        const rowSeed =
            random(
                row,
                999,
                0
            )

        const rowVisibility =
            0.20 +
            fadeProgress *
            0.80

        if (
            rowSeed >
            rowVisibility
        ) {
            continue
        }

        // -------------------------------------
        // FIELD EXPANSION
        // -------------------------------------

        const expansion =
            Math.pow(
                progress,
                0.72
            )

        const columns =
            Math.min(
                FIELD.maxColumns,
                Math.floor(
                    expansion *
                    FIELD.maxColumns
                )
            )

        // -------------------------------------
        // COLUMNS
        // -------------------------------------

        for (
            let column = 0;
            column < columns;
            column++
        ) {
            const distance =
                FIELD.firstColumnDistance +
                column *
                FIELD.columnGap

            createSideParticle(
                group,
                -distance,
                y,
                row,
                column,
                -1,
                progress,
                fadeProgress
            )

            createSideParticle(
                group,
                distance,
                y,
                row,
                column,
                1,
                progress,
                fadeProgress
            )
        }
    }
}