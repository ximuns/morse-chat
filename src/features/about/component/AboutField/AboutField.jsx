import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import './AboutField.css'

function AboutField({ progress }) {
    const containerRef = useRef(null)
    const progressRef = useRef(0)

    useEffect(() => {
        return progress.on('change', value => {
            progressRef.current = value
        })
    }, [progress])

    useEffect(() => {
        const container = containerRef.current

        const scene = new THREE.Scene()

        const camera = new THREE.OrthographicCamera(
            -window.innerWidth / 2,
            window.innerWidth / 2,
            window.innerHeight / 2,
            -window.innerHeight / 2,
            0.1,
            2000
        )

        camera.position.z = 500

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        })

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setClearColor(0x000000, 0)

        container.appendChild(renderer.domElement)

        const count = 1800
        const positions = new Float32Array(count * 3)
        const basePositions = new Float32Array(count * 3)
        const randoms = new Float32Array(count)
        const sizes = new Float32Array(count)

        const width = window.innerWidth * 1.7
        const height = window.innerHeight * 5

        for (let i = 0; i < count; i++) {
            const i3 = i * 3

            const x = (Math.random() - 0.5) * width
            const y = (Math.random() - 0.5) * height

            positions[i3] = x
            positions[i3 + 1] = y
            positions[i3 + 2] = (Math.random() - 0.5) * 100

            basePositions[i3] = x
            basePositions[i3 + 1] = y
            basePositions[i3 + 2] = positions[i3 + 2]

            randoms[i] = Math.random()
            sizes[i] = Math.random()
        }

        const geometry = new THREE.BufferGeometry()

        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(positions, 3)
        )

        geometry.setAttribute(
            'aRandom',
            new THREE.BufferAttribute(randoms, 1)
        )

        geometry.setAttribute(
            'aSize',
            new THREE.BufferAttribute(sizes, 1)
        )

        const material = new THREE.ShaderMaterial({
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            uniforms: {
                uTime: { value: 0 },
                uMouse: { value: new THREE.Vector2(9999, 9999) },
                uProgress: { value: 0 },
            },
            vertexShader: `
                uniform float uTime;
                uniform vec2 uMouse;
                uniform float uProgress;

                attribute float aRandom;
                attribute float aSize;

                varying float vAlpha;

                void main() {
                    vec3 pos = position;

                    float wave = sin(pos.y * 0.004 + uTime * 0.35 + aRandom * 6.2831);
                    float wave2 = cos(pos.x * 0.003 + uTime * 0.2 + aRandom * 5.0);

                    pos.x += wave * 35.0;
                    pos.y += wave2 * 18.0;

                    float mouseDistance = distance(pos.xy, uMouse);

                    float influence = smoothstep(180.0, 0.0, mouseDistance);

                    vec2 direction = normalize(pos.xy - uMouse + vec2(0.001));

                    pos.xy += direction * influence * 70.0;

                    float depth = sin(uProgress * 6.2831 + aRandom * 6.2831);

                    pos.z += depth * 30.0;

                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

                    gl_PointSize = (2.0 + aSize * 3.0) * (500.0 / -mvPosition.z);

                    gl_Position = projectionMatrix * mvPosition;

                    vAlpha = 0.12 + aRandom * 0.42;
                }
            `,
            fragmentShader: `
                varying float vAlpha;

                void main() {
                    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));

                    float alpha = 1.0 - smoothstep(0.05, 0.5, distanceToCenter);

                    gl_FragColor = vec4(
                        0.82,
                        0.84,
                        0.81,
                        alpha * vAlpha
                    );
                }
            `,
        })

        const particles = new THREE.Points(geometry, material)

        scene.add(particles)

        const glowGeometry = new THREE.PlaneGeometry(
            window.innerWidth * 1.5,
            280
        )

        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x858b86,
            transparent: true,
            opacity: 0.035,
            depthWrite: false,
        })

        const glow = new THREE.Mesh(glowGeometry, glowMaterial)

        glow.position.z = -80

        scene.add(glow)

        const signalCount = 22
        const signalLines = []

        for (let i = 0; i < signalCount; i++) {
            const points = []

            const startX = -window.innerWidth * 0.55
            const endX = window.innerWidth * 0.55
            const y = (i - signalCount / 2) * 26

            points.push(
                new THREE.Vector3(startX, y, -30)
            )

            for (let j = 1; j < 9; j++) {
                const x = THREE.MathUtils.lerp(
                    startX,
                    endX,
                    j / 9
                )

                const yy =
                    y +
                    Math.sin(j * 1.7 + i) * 14

                points.push(
                    new THREE.Vector3(x, yy, -30)
                )
            }

            points.push(
                new THREE.Vector3(endX, y, -30)
            )

            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)

            const lineMaterial = new THREE.LineBasicMaterial({
                color: 0x9da39f,
                transparent: true,
                opacity: 0.025,
            })

            const line = new THREE.Line(
                lineGeometry,
                lineMaterial
            )

            scene.add(line)

            signalLines.push(line)
        }

        const mouse = new THREE.Vector2(9999, 9999)
        const targetMouse = new THREE.Vector2(9999, 9999)

        const handlePointerMove = event => {
            targetMouse.x =
                event.clientX -
                window.innerWidth / 2

            targetMouse.y =
                window.innerHeight / 2 -
                event.clientY
        }

        const handlePointerLeave = () => {
            targetMouse.set(9999, 9999)
        }

        window.addEventListener(
            'pointermove',
            handlePointerMove
        )

        window.addEventListener(
            'pointerleave',
            handlePointerLeave
        )

        const handleResize = () => {
            camera.left = -window.innerWidth / 2
            camera.right = window.innerWidth / 2
            camera.top = window.innerHeight / 2
            camera.bottom = -window.innerHeight / 2
            camera.updateProjectionMatrix()

            renderer.setSize(
                window.innerWidth,
                window.innerHeight
            )

            glow.geometry.dispose()

            glow.geometry =
                new THREE.PlaneGeometry(
                    window.innerWidth * 1.5,
                    280
                )
        }

        window.addEventListener(
            'resize',
            handleResize
        )

        const clock = new THREE.Clock()

        let animationFrame

        const animate = () => {
            animationFrame =
                requestAnimationFrame(animate)

            const time = clock.getElapsedTime()

            material.uniforms.uTime.value = time
            material.uniforms.uProgress.value =
                progressRef.current

            mouse.lerp(targetMouse, 0.055)

            material.uniforms.uMouse.value.copy(
                mouse
            )

            const scroll =
                progressRef.current

            particles.rotation.z =
                Math.sin(time * 0.08) * 0.025

            particles.position.y =
                -scroll * 850

            particles.position.x =
                Math.sin(scroll * Math.PI * 2) * 40

            glow.position.y =
                Math.sin(time * 0.12) * 120 -
                scroll * 850

            glow.rotation.z =
                Math.sin(time * 0.08) * 0.04

            signalLines.forEach((line, index) => {
                line.position.y =
                    -scroll * 850 +
                    Math.sin(
                        time * 0.2 +
                        index * 0.4
                    ) * 20

                line.rotation.z =
                    Math.sin(
                        time * 0.08 +
                        index
                    ) * 0.003
            })

            renderer.render(
                scene,
                camera
            )
        }

        animate()

        return () => {
            cancelAnimationFrame(animationFrame)

            window.removeEventListener(
                'pointermove',
                handlePointerMove
            )

            window.removeEventListener(
                'pointerleave',
                handlePointerLeave
            )

            window.removeEventListener(
                'resize',
                handleResize
            )

            geometry.dispose()
            material.dispose()
            glow.geometry.dispose()
            glowMaterial.dispose()

            signalLines.forEach(line => {
                line.geometry.dispose()
                line.material.dispose()
            })

            renderer.dispose()

            if (container.contains(renderer.domElement)) {
                container.removeChild(
                    renderer.domElement
                )
            }
        }
    }, [])

    return (
        <div
            ref={containerRef}
            className="about-field"
        />
    )
}

export default AboutField