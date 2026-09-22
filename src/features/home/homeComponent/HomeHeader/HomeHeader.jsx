import './HomeHeader.css'

function HomeHeader({ onAbout }) {
    return (
        <header className="header">
            <a href="/" className="header__logo">
                MORSE.CHAT
            </a>

            <nav className="header__nav">
                <button
                    type="button"
                    className="header__link"
                    onClick={onAbout}
                >
                    О НАС
                </button>

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