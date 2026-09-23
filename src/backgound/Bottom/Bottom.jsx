import {
    useEffect,
    useRef,
} from 'react'

import * as THREE from 'three'

import './Bottom.css'

import {
    MORSE,
} from './config/settings'

import {
    createMorse,
    createSideField,
    createHorizonParticles,
    createGlow,
} from './systems'

function Bottom() {
    const containerRef =
        useRef(null)

    useEffect(() => {
        const container =
            containerRef.current

        if (!container) return

        // =====================================
        // SCENE
        // =====================================

        const scene =
            new THREE.Scene()

        // =====================================
        // SIZE
        // =====================================

        let width =
            window.innerWidth

        let height =
            window.innerHeight

        // =====================================
        // CAMERA
        // =====================================

        const camera =
            new THREE.OrthographicCamera(
                -width / 2,
                width / 2,
                height / 2,
                -height / 2,
                0.1,
                100
            )

        camera.position.z = 10

        // =====================================
        // RENDERER
        // =====================================

        const renderer =
            new THREE.WebGLRenderer({
                antialias: true,
                alpha: true,
            })

        renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                2
            )
        )

        renderer.setSize(
            width,
            height
        )

        renderer.setClearColor(
            0x000000,
            0
        )

        container.appendChild(
            renderer.domElement
        )

        // =====================================
        // GROUPS
        // =====================================

        const morseGroup =
            new THREE.Group()

        const sideParticlesGroup =
            new THREE.Group()

        const glowGroup =
            new THREE.Group()

        const horizonGroup =
            new THREE.Group()

        // =====================================
        // GLOW BEHIND EVERYTHING
        // =====================================

        glowGroup.position.z =
            -0.5

        scene.add(
            glowGroup
        )

        // =====================================
        // SCENE GROUPS
        // =====================================

        scene.add(
            morseGroup
        )

        scene.add(
            sideParticlesGroup
        )

        scene.add(
            horizonGroup
        )

        // =====================================
        // MORSE MATERIAL
        // =====================================

        const morseMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xdcded9,

                transparent: true,

                opacity: 0.82,

                depthWrite: false,
            })

        // =====================================
        // SIGNAL STATE
        // =====================================

        let signalEnergy = 0

        let signalTarget = 0

        let signalRotation = 0

        // =====================================
        // INITIAL BUILD
        // =====================================

        const glow =
            createGlow(
                glowGroup,
                width,
                height
            )

        createMorse(
            morseGroup,
            height,
            morseMaterial
        )

        createSideField(
            sideParticlesGroup,
            width,
            height
        )

        createHorizonParticles(
            horizonGroup,
            height
        )

        // =====================================
        // MORSE SIGNAL
        // =====================================

        function handleMorseSignal(
            event
        ) {
            const {
                signal,
                strength,
            } = event.detail || {}

            signalTarget =
                strength ??
                (
                    signal === '-'
                        ? 1
                        : 0.65
                )

            // Точка и тире имеют
            // немного разное движение.

            if (
                signal === '-'
            ) {
                signalRotation +=
                    0.12
            } else {
                signalRotation -=
                    0.07
            }
        }

        window.addEventListener(
            'morse:signal',
            handleMorseSignal
        )

        // =====================================
        // ANIMATION
        // =====================================

        let animationFrame

        function animate() {
            animationFrame =
                requestAnimationFrame(
                    animate
                )

            // ---------------------------------
            // ENERGY
            // ---------------------------------

            signalEnergy +=
                (
                    signalTarget -
                    signalEnergy
                ) * 0.14

            signalTarget *= 0.90

            // ---------------------------------
            // BASE MOTION
            // ---------------------------------

            const time =
                performance.now() *
                0.001

            // ---------------------------------
            // MORSE
            // ---------------------------------

            morseGroup.position.x =
                Math.sin(
                    time * 0.45
                ) *
                signalEnergy *
                1.5

            morseGroup.rotation.z =
                Math.sin(
                    time * 0.35
                ) *
                signalEnergy *
                0.003

            morseGroup.scale.y =
                1 +
                signalEnergy *
                0.025

            // ---------------------------------
            // PARTICLES
            // ---------------------------------

            sideParticlesGroup.position.x =
                Math.sin(
                    time * 0.55
                ) *
                signalEnergy *
                3

            sideParticlesGroup.position.y =
                Math.cos(
                    time * 0.40
                ) *
                signalEnergy *
                1.5

            // ---------------------------------
            // HORIZON
            // ---------------------------------

            horizonGroup.scale.x =
                1 +
                signalEnergy *
                0.035

            horizonGroup.scale.y =
                1 +
                signalEnergy *
                0.02

            // ---------------------------------
            // GLOW
            // ---------------------------------

            glowGroup.scale.x =
                1 +
                signalEnergy *
                0.08

            glowGroup.scale.y =
                1 +
                signalEnergy *
                0.045

            glowGroup.rotation.z =
                signalRotation +
                Math.sin(time * 0.15) *
                0.015

            // ---------------------------------
            // MATERIAL
            // ---------------------------------

            morseMaterial.opacity =
                0.82 +
                signalEnergy *
                0.12

            renderer.render(
                scene,
                camera
            )
        }

        animate()

        // =====================================
        // RESIZE
        // =====================================

        function handleResize() {
            width =
                window.innerWidth

            height =
                window.innerHeight

            // ---------------------------------
            // CAMERA
            // ---------------------------------

            camera.left =
                -width / 2

            camera.right =
                width / 2

            camera.top =
                height / 2

            camera.bottom =
                -height / 2

            camera.updateProjectionMatrix()

            // ---------------------------------
            // RENDERER
            // ---------------------------------

            renderer.setSize(
                width,
                height
            )

            // ---------------------------------
            // PARTICLES
            // ---------------------------------

            createSideField(
                sideParticlesGroup,
                width,
                height
            )

            // ---------------------------------
            // MORSE
            // ---------------------------------

            createMorse(
                morseGroup,
                height,
                morseMaterial
            )

            // ---------------------------------
            // GLOW
            // ---------------------------------

            const glowPositionY =
                -height / 2 +
                height * 0.245

            glow.glow.position.y =
                glowPositionY

            glow.ambientGlow.position.y =
                glowPositionY + 12

            glow.softGlow.position.y =
                glowPositionY - 2

            // ---------------------------------
            // HORIZON
            // ---------------------------------

            createHorizonParticles(
                horizonGroup,
                height
            )
        }

        window.addEventListener(
            'resize',
            handleResize
        )

        // =====================================
        // CLEANUP
        // =====================================

        return () => {
            cancelAnimationFrame(
                animationFrame
            )

            window.removeEventListener(
                'resize',
                handleResize
            )

            window.removeEventListener(
                'morse:signal',
                handleMorseSignal
            )

            // ---------------------------------
            // MORSE
            // ---------------------------------

            morseGroup.children.forEach(
                mesh => {
                    mesh.geometry.dispose()
                }
            )

            // ---------------------------------
            // SIDE PARTICLES
            // ---------------------------------

            sideParticlesGroup
                .children
                .forEach(mesh => {
                    mesh.geometry.dispose()
                    mesh.material.dispose()
                })

            // ---------------------------------
            // HORIZON
            // ---------------------------------

            horizonGroup
                .children
                .forEach(mesh => {
                    mesh.geometry.dispose()
                    mesh.material.dispose()
                })

            // ---------------------------------
            // GLOW
            // ---------------------------------

            glowGroup.children.forEach(
                sprite => {
                    if (
                        sprite.material.map
                    ) {
                        sprite.material.map.dispose()
                    }

                    sprite.material.dispose()
                }
            )

            // ---------------------------------
            // MORSE MATERIAL
            // ---------------------------------

            morseMaterial.dispose()

            // ---------------------------------
            // RENDERER
            // ---------------------------------

            renderer.dispose()

            if (
                renderer.domElement.parentNode
            ) {
                renderer.domElement.parentNode.removeChild(
                    renderer.domElement
                )
            }
        }
    }, [])

    return (
        <div
            ref={containerRef}
            className="bottom"
        />
    )
}

export default Bottom