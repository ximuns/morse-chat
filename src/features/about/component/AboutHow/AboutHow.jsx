import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import './AboutHow.css'

const steps = [
  {
    id: '01',
    title: 'СОЗДАТЬ',
    description: 'Создай приватную комнату.',
    label: 'СОЗДАНИЕ ПРИВАТНОЙ КОМНАТЫ',
    morse: '-.-. .-. . .- - .',
  },
  {
    id: '02',
    title: 'ПРИГЛАСИТЬ',
    description: 'Передай код приглашения человеку.',
    label: 'ПЕРЕДАЧА СИГНАЛА',
    morse: '.. -. ...- .. - .',
  },
  {
    id: '03',
    title: 'СВЯЗАТЬ',
    description: 'Подключитесь к одной комнате.',
    label: 'УСТАНОВКА СОЕДИНЕНИЯ',
    morse: '-.-. --- -. -. . -.-. -',
  },
  {
    id: '04',
    title: 'ОБЩАТЬСЯ',
    description: 'Общайтесь исключительно через Morse.',
    label: 'НАЧАЛО ОБЩЕНИЯ',
    morse: '-.-. --- -- -- ..- -. .. -.-. .- - .',
  },
]

function AboutHow() {
  const [active, setActive] = useState(0)
  const [previous, setPrevious] = useState(0)

  const current = steps[active]

  function activateStep(index) {
    if (index === active) return

    setPrevious(active)
    setActive(index)
  }

  return (
    <section className="about-how">
      <div className="about-how__top">
        <div className="about-how__number">05</div>

        <div className="about-how__label">КАК ЭТО РАБОТАЕТ</div>

        <div className="about-how__status">ПРОТОКОЛ СВЯЗИ</div>
      </div>

      <div className="about-how__heading">
        <h2>
          У СИГНАЛА
          <br />
          <span>ЕСТЬ ПУТЬ.</span>
        </h2>

        <p>От создания комнаты до первого сообщения — всё происходит последовательно.</p>
      </div>

      <div className="about-how__system">
        <nav className="about-how__steps">
          {steps.map((step, index) => {
            const isActive = index === active

            return (
              <button
                key={step.id}
                type="button"
                className={`how-step ${isActive ? 'how-step--active' : ''}`}
                onMouseEnter={() => activateStep(index)}
                onFocus={() => activateStep(index)}
                onClick={() => activateStep(index)}
              >
                <span className="how-step__number">{step.id}</span>

                <span className="how-step__name">{step.title}</span>

                <span className="how-step__indicator">
                  <span />
                </span>
              </button>
            )
          })}
        </nav>

        <div className="about-how__visual">
          <div className="protocol-grid" />

          <div className="protocol-meta">
            <span>ПРОТОКОЛ / 05</span>

            <span>
              {String(active + 1).padStart(2, '0')}
              /04
            </span>
          </div>

          <div className="protocol-route">
            <div className="protocol-route__base" />

            <motion.div
              className="protocol-route__progress"
              animate={{
                width: `${active * 33.333}%`,
              }}
              transition={{
                duration: 1.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            />

            <motion.span
              key={`${previous}-${active}`}
              className="protocol-route__pulse"
              initial={{
                left: `${previous * 33.333}%`,
              }}
              animate={{
                left: `${active * 33.333}%`,
              }}
              transition={{
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
              }}
            />

            <div className="protocol-route__nodes">
              {steps.map((step, index) => (
                <span
                  key={step.id}
                  className={index === active ? 'route-node route-node--active' : 'route-node'}
                >
                  <span className="route-node__core" />

                  <span className="route-node__id">{step.id}</span>
                </span>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              className="protocol-scene"

              initial={{
                opacity: 0,
                y: 25,
                filter: 'blur(10px)',
              }}

              animate={{
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
              }}

              exit={{
                opacity: 0,
                y: -20,
                filter: 'blur(8px)',
              }}

              transition={{
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="protocol-scene__eyebrow">{current.label}</div>

              <div className="protocol-scene__morse" aria-label={`Morse сигнал: ${current.title}`}>
                {current.morse.split(' ').map((letter, letterIndex) => (
                  <span key={`${current.id}-${letterIndex}`} className="morse-letter">
                    {letter.split('').map((symbol, symbolIndex) => (
                      <motion.span
                        key={`${letterIndex}-${symbolIndex}`}
                        initial={{
                          opacity: 0,
                          y: 12,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay: letterIndex * 0.035 + symbolIndex * 0.025,

                          duration: 0.45,

                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        {symbol}
                      </motion.span>
                    ))}
                  </span>
                ))}
              </div>

              <div className="protocol-scene__title">{current.title}</div>

              <p className="protocol-scene__description">{current.description}</p>

              <div className="protocol-scene__status">
                <span className="status-dot" />
                СИГНАЛ АКТИВЕН
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="protocol-corner protocol-corner--tl">+</div>

          <div className="protocol-corner protocol-corner--tr">+</div>

          <div className="protocol-corner protocol-corner--bl">+</div>

          <div className="protocol-corner protocol-corner--br">+</div>
        </div>
      </div>

      <div className="about-how__bottom">
        <span>ОДНА КОМНАТА / ОДИН СИГНАЛ</span>

        <span>НЕТ ЛЕНТЫ / НЕТ ШУМА</span>

        <span>ПРОКРУТИТЕ ↑</span>
      </div>
    </section>
  )
}

export default AboutHow
