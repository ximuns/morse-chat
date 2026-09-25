import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

import IdentityMenu from '../../../identity/IdentityMenu/IdentityMenu'

import './HomeHeader.css'

function HomeHeader({ onAbout, onRooms }) {
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  function handleAbout() {
    closeMenu()
    onAbout?.()
  }

  function handleRooms() {
    closeMenu()
    onRooms?.()
  }

  return (
    <>
      <header className="header">
        <a href="/" className="header__logo" onClick={closeMenu}>
          MORSE.CHAT
        </a>

        <nav className="header__nav">
          <button type="button" className="header__link" onClick={handleAbout}>
            О НАС
          </button>

          <button type="button" className="header__link" onClick={handleRooms}>
            КОМНАТЫ
          </button>

          <IdentityMenu />

          <button
            type="button"
            className={`header__morse ${menuOpen ? 'header__morse--open' : ''}`}
            aria-label="Открыть меню"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span className="header__morse-dot" />
            <span className="header__morse-line" />
            <span className="header__morse-dot" />
            <span className="header__morse-dot" />
            <span className="header__morse-line" />
            <span className="header__morse-dot" />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              onClick={closeMenu}
            />

            <motion.aside
              className="morse-menu"
              initial={{
                opacity: 0,
                clipPath: 'polygon(100% 0, 100% 0, 100% 0, 100% 0)',
                transform: 'translateY(-20px)',
              }}
              animate={{
                opacity: 1,
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                transform: 'translateY(0)',
              }}
              exit={{
                opacity: 0,
                clipPath: 'polygon(100% 0, 100% 0, 100% 0, 100% 0)',
                transform: 'translateY(-20px)',
              }}
              transition={{
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="morse-menu__noise" />

              <div className="morse-menu__top">
                <span>НАВИГАЦИЯ</span>

                <span>SIGNAL / 001</span>
              </div>

              <div className="morse-menu__content">
                <div className="morse-menu__intro">
                  <span>МОЁ ПРОСТРАНСТВО</span>

                  <div className="morse-menu__morse">· − · · &nbsp;&nbsp; − − −</div>
                </div>

                <nav className="morse-menu__nav">
                  <button type="button" onClick={handleAbout}>
                    <span>01</span>
                    <strong>О НАС</strong>
                    <i>↗</i>
                  </button>

                  <button type="button" onClick={handleRooms}>
                    <span>02</span>
                    <strong>КОМНАТЫ</strong>
                    <i>↗</i>
                  </button>
                </nav>

                <div className="morse-menu__signal">
                  <div className="morse-menu__signal-line">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>

                  <div className="morse-menu__signal-meta">
                    <span>PRIVATE SIGNAL</span>
                    <span>ГОТОВ К СВЯЗИ</span>
                  </div>
                </div>
              </div>

              <div className="morse-menu__bottom">
                <span>MORSE.CHAT</span>
                <span>ТОЧКА / ПАУЗА / СИГНАЛ</span>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default HomeHeader
