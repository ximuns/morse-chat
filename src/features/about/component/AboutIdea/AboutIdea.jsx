import { motion, useScroll, useTransform } from 'motion/react'

import { useRef } from 'react'

import './AboutIdea.css'

const message = 'ПРИВЕТ, КАК ТЫ?'

const morseMap = {
  А: '.-',
  Б: '-...',
  В: '.--',
  Г: '--.',
  Д: '-..',
  Е: '.',
  Ё: '.',
  Ж: '...-',
  З: '--..',
  И: '..',
  Й: '.---',
  К: '-.-',
  Л: '.-..',
  М: '--',
  Н: '-.',
  О: '---',
  П: '.--.',
  Р: '.-.',
  С: '...',
  Т: '-',
  У: '..-',
  Ф: '..-.',
  Х: '....',
  Ц: '-.-.',
  Ч: '---.',
  Ш: '----',
  Щ: '--.-',
  Ъ: '--.--',
  Ы: '-.--',
  Ь: '-..-',
  Э: '..-..',
  Ю: '..--',
  Я: '.-.-',
}

/*
    Убираем пробелы и знаки препинания для
    последовательности преобразования.
*/
const letters = message.replace(/[^А-ЯЁ]/g, '').split('')

/*
    Буква → Morse
*/
const conversion = letters.map((letter) => ({
  letter,
  code: morseMap[letter],
}))

/*
    Формируем единый Morse-поток.
    Между словами будет дополнительный промежуток.
*/
const wordGroups = ['ПРИВЕТ', 'КАК', 'ТЫ']

const morseStream = []

wordGroups.forEach((word, wordIndex) => {
  word.split('').forEach((letter, letterIndex) => {
    const code = morseMap[letter]

    code.split('').forEach((char, charIndex) => {
      morseStream.push({
        char,
        key: `${wordIndex}-${letterIndex}-${charIndex}`,
      })
    })

    /*
            Небольшая пауза между буквами
        */
    morseStream.push({
      char: 'letter-space',
      key: `${wordIndex}-${letterIndex}-space`,
    })
  })

  /*
        Больше расстояние между словами
    */
  morseStream.push({
    char: 'word-space',
    key: `${wordIndex}-word-space`,
  })
})

function MessageLetter({ letter, index, progress }) {
  const center = (letters.length - 1) / 2

  const distance = index - center

  /*
        Сначала буквы стоят на месте.
        Затем начинают расходиться.
    */
  const x = useTransform(progress, [0.12, 0.23, 0.37, 0.5], [0, 0, distance * 10, distance * 19])

  const y = useTransform(progress, [0.12, 0.25, 0.4, 0.52], [0, -4, distance * 8, distance * 26])

  const rotate = useTransform(progress, [0.18, 0.35, 0.52], [0, distance * 0.2, distance * 1.1])

  const scale = useTransform(progress, [0.12, 0.27, 0.44, 0.56], [1, 1, 0.88, 0.22])

  const opacity = useTransform(progress, [0.1, 0.2, 0.42, 0.56], [1, 1, 0.72, 0])

  const blur = useTransform(progress, [0.28, 0.43, 0.56], ['blur(0px)', 'blur(1px)', 'blur(9px)'])

  return (
    <motion.span
      className="about-idea__message-letter"
      style={{
        x,
        y,
        rotate,
        scale,
        opacity,
        filter: blur,
      }}
    >
      {letter}
    </motion.span>
  )
}

function ConversionItem({ letter, code, index, progress }) {
  const letterY = useTransform(progress, [0.2, 0.32, 0.46], [45, 0, -25])

  const letterOpacity = useTransform(progress, [0.2, 0.28, 0.42, 0.52], [0, 1, 0.78, 0])

  const lineScaleY = useTransform(progress, [0.25, 0.35, 0.47], [0, 1, 1])

  const codeY = useTransform(progress, [0.28, 0.39, 0.54], [35, 0, -8])

  const codeOpacity = useTransform(progress, [0.27, 0.38, 0.52, 0.62], [0, 1, 1, 0])

  const codeScale = useTransform(progress, [0.3, 0.42, 0.56], [0.72, 1, 1.06])

  return (
    <div
      className="about-idea__conversion-item"
      style={{
        '--index': index,
      }}
    >
      <motion.div
        className="about-idea__conversion-letter"
        style={{
          y: letterY,
          opacity: letterOpacity,
        }}
      >
        {letter}
      </motion.div>

      <motion.div
        className="about-idea__conversion-line"
        style={{
          scaleY: lineScaleY,
        }}
      />

      <motion.div
        className="about-idea__conversion-code"
        style={{
          y: codeY,
          opacity: codeOpacity,
          scale: codeScale,
        }}
      >
        {code}
      </motion.div>
    </div>
  )
}

function MorseGlyph({ char, index, progress }) {
  const center = (morseStream.length - 1) / 2

  const distance = index - center

  /*
        При появлении символы приходят
        из разных сторон.
    */
  const x = useTransform(progress, [0.43, 0.55, 0.69, 0.82], [distance * 28, distance * 13, 0, 0])

  const y = useTransform(
    progress,
    [0.43, 0.56, 0.7, 0.82],
    [((index % 3) - 1) * 32, ((index % 3) - 1) * 12, 0, 0],
  )

  const opacity = useTransform(progress, [0.42, 0.5, 0.65, 0.82, 0.9], [0, 0.15, 1, 0.92, 0])

  const scale = useTransform(progress, [0.45, 0.6, 0.76], [0.5, 0.82, 1])

  if (char === 'letter-space') {
    return (
      <motion.span
        className="about-idea__morse-letter-space"
        style={{
          x,
          y,
          opacity,
        }}
      />
    )
  }

  if (char === 'word-space') {
    return (
      <motion.span
        className="about-idea__morse-word-space"
        style={{
          x,
          y,
          opacity,
        }}
      />
    )
  }

  return (
    <motion.span
      className={char === '.' ? 'about-idea__morse-dot' : 'about-idea__morse-dash'}
      style={{
        x,
        y,
        opacity,
        scale,
      }}
    />
  )
}

function AboutIdea() {
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  /*
        ======================================================
        INTRO
        ======================================================
    */

  const introOpacity = useTransform(scrollYProgress, [0, 0.05, 0.16, 0.29], [0, 1, 1, 0])

  const introY = useTransform(scrollYProgress, [0, 0.15, 0.29], [45, 0, -35])

  /*
        ======================================================
        MESSAGE
        ======================================================
    */

  const messageOpacity = useTransform(scrollYProgress, [0.07, 0.15, 0.4, 0.57], [0, 1, 1, 0])

  const messageScale = useTransform(scrollYProgress, [0.08, 0.2, 0.43, 0.56], [0.9, 1, 0.96, 0.82])

  /*
        ======================================================
        CONVERSION
        ======================================================
    */

  const conversionOpacity = useTransform(scrollYProgress, [0.22, 0.3, 0.52, 0.66], [0, 1, 1, 0])

  const conversionScale = useTransform(scrollYProgress, [0.24, 0.39, 0.57], [0.84, 1, 1.02])

  /*
        ======================================================
        MORSE
        ======================================================
    */

  const morseOpacity = useTransform(scrollYProgress, [0.48, 0.6, 0.81, 0.91], [0, 1, 1, 0])

  const morseScale = useTransform(scrollYProgress, [0.5, 0.7, 0.88], [0.72, 0.9, 1])

  const morseY = useTransform(scrollYProgress, [0.5, 0.71, 0.9], [70, 0, -10])

  /*
        ======================================================
        FINAL
        ======================================================
    */

  const finalOpacity = useTransform(scrollYProgress, [0.76, 0.87, 1], [0, 1, 1])

  const finalY = useTransform(scrollYProgress, [0.77, 0.95], [55, 0])

  /*
        ======================================================
        RIGHT CHAPTER NAV
        ======================================================
    */

  const stage1 = useTransform(scrollYProgress, [0, 0.17, 0.3], [1, 1, 0.25])

  const stage2 = useTransform(scrollYProgress, [0.25, 0.38, 0.55, 0.66], [0.25, 1, 1, 0.25])

  const stage3 = useTransform(scrollYProgress, [0.56, 0.72, 0.87, 1], [0.25, 1, 1, 1])

  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section ref={sectionRef} className="about-idea">
      <div className="about-idea__sticky">
        {/* ==================================================
                    BACKGROUND
                ================================================== */}

        <div className="about-idea__background" />

        <div className="about-idea__grid" />

        <div className="about-idea__glow" />

        {/* ==================================================
                    TOP HEADER
                ================================================== */}

        <header className="about-idea__header">
          <span>02</span>

          <span>ИДЕЯ</span>

          <span>ОТ СЛОВА К СИГНАЛУ</span>
        </header>

        {/* ==================================================
                    CHAPTERS
                ================================================== */}

        <aside className="about-idea__chapters">
          <motion.div
            style={{
              opacity: stage1,
            }}
          >
            <span>01</span>

            <strong>СЛОВО</strong>
          </motion.div>

          <motion.div
            style={{
              opacity: stage2,
            }}
          >
            <span>02</span>

            <strong>ПРЕОБРАЗОВАНИЕ</strong>
          </motion.div>

          <motion.div
            style={{
              opacity: stage3,
            }}
          >
            <span>03</span>

            <strong>СИГНАЛ</strong>
          </motion.div>
        </aside>

        {/* ==================================================
                    INTRO — TOP LEFT
                ================================================== */}

        <motion.div
          className="about-idea__intro"
          style={{
            opacity: introOpacity,
            y: introY,
          }}
        >
          <div className="about-idea__intro-label">КАК ЭТО РАБОТАЕТ</div>

          <h2>
            ОТ СЛОВА
            <br />К СИГНАЛУ.
          </h2>

          <p>
            Сообщение начинается с мысли. В MORSE.CHAT оно не меняет смысл — только форму передачи.
          </p>
        </motion.div>

        {/* ==================================================
                    MESSAGE — CENTER
                ================================================== */}

        <motion.div
          className="about-idea__message"
          style={{
            opacity: messageOpacity,
            scale: messageScale,
          }}
        >
          <div className="about-idea__message-label">ТВОЁ СООБЩЕНИЕ</div>

          <div className="about-idea__message-word">
            {letters.map((letter, index) => (
              <MessageLetter
                key={`${letter}-${index}`}
                letter={letter}
                index={index}
                progress={scrollYProgress}
              />
            ))}
          </div>

          <div className="about-idea__message-text">Сначала это просто фраза.</div>
        </motion.div>

        {/* ==================================================
                    CONVERSION — CENTER / UPPER
                ================================================== */}

        <motion.div
          className="about-idea__conversion"
          style={{
            opacity: conversionOpacity,
            scale: conversionScale,
          }}
        >
          <div className="about-idea__conversion-head">
            <span>ПРЕОБРАЗОВАНИЕ</span>

            <span>БУКВА → СИГНАЛ</span>
          </div>

          <div className="about-idea__conversion-grid">
            {conversion.map(({ letter, code }, index) => (
              <ConversionItem
                key={`${letter}-${index}`}
                letter={letter}
                code={code}
                index={index}
                progress={scrollYProgress}
              />
            ))}
          </div>

          <div className="about-idea__conversion-caption">
            <span>КАЖДАЯ БУКВА</span>

            <span>ПОЛУЧАЕТ СВОЮ ПОСЛЕДОВАТЕЛЬНОСТЬ</span>

            <span>СМЫСЛ НЕ МЕНЯЕТСЯ</span>
          </div>
        </motion.div>

        {/* ==================================================
                    MORSE — CENTRAL LOWER
                ================================================== */}

        <motion.div
          className="about-idea__morse"
          style={{
            opacity: morseOpacity,
            scale: morseScale,
            y: morseY,
          }}
        >
          <div className="about-idea__morse-head">
            <span>ГОТОВЫЙ СИГНАЛ</span>

            <span>ФОРМА ИЗМЕНЕНА</span>
          </div>

          <div className="about-idea__morse-message">ПРИВЕТ, КАК ТЫ?</div>

          <div className="about-idea__morse-stream">
            {morseStream.map((glyph, index) => (
              <MorseGlyph
                key={glyph.key}
                char={glyph.char}
                index={index}
                progress={scrollYProgress}
              />
            ))}
          </div>

          <div className="about-idea__morse-words">
            {wordGroups.map((word) => (
              <div key={word}>
                <span>{word}</span>

                <strong>
                  {word
                    .split('')
                    .map((letter) => morseMap[letter])
                    .join(' ')}
                </strong>
              </div>
            ))}
          </div>

          <p className="about-idea__morse-description">
            Теперь сообщение можно передать через короткие и длинные импульсы.
          </p>
        </motion.div>

        {/* ==================================================
                    FINAL — BOTTOM LEFT
                ================================================== */}

        <motion.div
          className="about-idea__final"
          style={{
            opacity: finalOpacity,
            y: finalY,
          }}
        >
          <div className="about-idea__final-label">ВОТ В ЧЁМ ИДЕЯ</div>

          <div className="about-idea__final-line">ФОРМА</div>

          <div className="about-idea__final-line">МЕНЯЕТСЯ.</div>

          <div className="about-idea__final-line about-idea__final-line--muted">СМЫСЛ</div>

          <div className="about-idea__final-line about-idea__final-line--muted">ОСТАЁТСЯ.</div>
        </motion.div>

        {/* ==================================================
                    BOTTOM RIGHT EXAMPLE
                ================================================== */}

        <motion.div
          className="about-idea__example"
          style={{
            opacity: finalOpacity,
          }}
        >
          <div className="about-idea__example-head">
            <span>НА ПРИМЕРЕ</span>

            <span>ОДНО СООБЩЕНИЕ</span>
          </div>

          <div className="about-idea__example-body">
            <div className="about-idea__example-word">ПРИВЕТ</div>

            <div className="about-idea__example-arrow">→</div>

            <div className="about-idea__example-code">.--. .-. .. .-- . -</div>
          </div>
        </motion.div>

        {/* ==================================================
                    BOTTOM PROGRESS
                ================================================== */}

        <div className="about-idea__bottom">
          <span>SCROLL</span>

          <div className="about-idea__progress">
            <motion.div
              style={{
                width: progressWidth,
              }}
            />
          </div>

          <span>03 / 03</span>
        </div>
      </div>
    </section>
  )
}

export default AboutIdea
