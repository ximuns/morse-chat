import { useEffect, useRef } from 'react'

function useScrollParallax(speed = 0.1) {

    const ref = useRef(null)

    useEffect(() => {

        let frame

        let current = 0

        function update() {

            if (!ref.current) {
                frame =
                    requestAnimationFrame(update)

                return
            }

            const rect =
                ref.current.getBoundingClientRect()

            const viewportCenter =
                window.innerHeight / 2

            const elementCenter =
                rect.top +
                rect.height / 2

            const distance =
                elementCenter -
                viewportCenter

            const target =
                distance * speed

            current +=
                (target - current) * .08

            ref.current.style.transform =
                `translate3d(0, ${current}px, 0)`

            frame =
                requestAnimationFrame(update)
        }

        update()

        return () => {
            cancelAnimationFrame(frame)
        }

    }, [speed])

    return ref
}

export default useScrollParallax