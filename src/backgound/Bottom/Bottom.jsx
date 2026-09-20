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
        // RENDER
        // =====================================

        function render() {
            renderer.render(
                scene,
                camera
            )
        }

        render()

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

            render()
        }

        window.addEventListener(
            'resize',
            handleResize
        )

        // =====================================
        // CLEANUP
        // =====================================

        return () => {
            window.removeEventListener(
                'resize',
                handleResize
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