import './HomeHeader.css'

function HomeHeader() {
    return (
        <header className="header">
            <a href="/" className="header__logo">
                MORSE.CHAT
            </a>

            <nav className="header__nav">
                <a href="#about" className="header__link">
                    О НАС
                </a>

                <button
                    className="header__morse"
                    aria-label="Morse menu"
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
    )
}

export default HomeHeader