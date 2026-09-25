import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import './ScatterText.css'

function random(min, max) {
  return Math.random() * (max - min) + min
}

function ScatterText({ children, className = '', scatter = 260, rotation = 70, duration = 1.5 }) {
  const containerRef = useRef(null)

  const [letters, setLetters] = useState([])

  const text = String(children)

  function scatterLetter(index) {
    const container = containerRef.current

    if (!container) return

    const section = container.closest('.about-why')

    if (!section) return

    const sectionRect = section.getBoundingClientRect()

    const maxX = sectionRect.width * 0.72

    const maxY = sectionRect.height * 0.55

    const angle = random(0, Math.PI * 2)

    const distance = random(scatter * 0.8, scatter * 1.8)

    let x = Math.cos(angle) * distance

    let y = Math.sin(angle) * distance

    x = Math.max(-maxX, Math.min(maxX, x))

    y = Math.max(-maxY, Math.min(maxY, y))

    const rotate = random(-rotation, rotation)

    setLetters((current) => {
      const exists = current.some((item) => item.index === index)

      if (exists) {
        return current
      }

      return [
        ...current,
        {
          index,
          x,
          y,
          rotate,
        },
      ]
    })
  }

  function returnLetter(index) {
    setLetters((current) => current.filter((item) => item.index !== index))
  }

  return (
    <span ref={containerRef} className={`scatter-text ${className}`}>
      {text.split('').map((letter, index) => {
        if (letter === ' ') {
          return (
            <span key={index} className="scatter-text__space">
              {' '}
            </span>
          )
        }

        const state = letters.find((item) => item.index === index)

        const scattered = Boolean(state)

        return (
          <motion.span
            key={index}
            className={`scatter-text__letter ${scattered ? 'scatter-text__letter--scattered' : ''}`}
            animate={{
              x: state?.x ?? 0,

              y: state?.y ?? 0,

              rotate: state?.rotate ?? 0,
            }}
            transition={{
              duration,
              ease: [0.16, 1, 0.3, 1],
            }}
            onMouseEnter={() => {
              if (scattered) {
                returnLetter(index)

                return
              }

              scatterLetter(index)
            }}
          >
            {letter}
          </motion.span>
        )
      })}
    </span>
  )
}

export default ScatterText
