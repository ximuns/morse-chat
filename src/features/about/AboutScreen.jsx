import { motion } from 'motion/react'

import './AboutScreen.css'
import AboutHero from './component/AboutHero/AboutHero'
import AboutWhy from './component/AboutWhy/AboutWhy'
import AboutIdea from './component/AboutIdea/AboutIdea'
import AboutPrivate from './component/AboutPrivate/AboutPrivate'
import AboutHow from './component/AboutHow/AboutHow'

function AboutScreen({ onBack }) {
  return (
    <motion.main
      className="about-screen"
      initial={{
        opacity: 0,
        filter: 'blur(14px)',
      }}
      animate={{
        opacity: 1,
        filter: 'blur(0px)',
      }}
      exit={{
        opacity: 0,
        filter: 'blur(12px)',
      }}
      transition={{
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <div className="about-noise" />

      <header className="about-top">
        <div className="about-top__logo">MORSE.CHAT</div>

        <div className="about-top__label">О НАС</div>

        <button type="button" className="about-top__back" onClick={onBack}>
          <span>НАЗАД</span>
          <span className="about-top__back-arrow">↗</span>
        </button>
      </header>

      <AboutHero />

      <AboutWhy />

      <AboutIdea />

      <AboutPrivate />

      <AboutHow />

      <footer className="about-footer">
        <div className="about-footer__title">MORSE.CHAT</div>

        <div className="about-footer__subtitle">ОБЩАЙТЕСЬ БЕЗ ШУМА.</div>

        <button type="button" className="about-footer__back" onClick={onBack}>
          ВЕРНУТЬСЯ НА ГЛАВНУЮ
          <span>↗</span>
        </button>
      </footer>
    </motion.main>
  )
}

export default AboutScreen
