import './HomeFooter.css'

function HomeFooter() {
    return (
        <footer className="footer">
            <div className="footer__hint">
                ЖМИ&nbsp;&nbsp;·&nbsp;&nbsp;УДЕРЖИВАЙ&nbsp;&nbsp;·&nbsp;&nbsp;ОБЩАЙСЯ
            </div>

            <div className="footer__morse">
                <span className="footer__dot" />
                <span className="footer__dot" />
                <span className="footer__dot" />

                <span className="footer__line" />

                <span className="footer__dot" />
                <span className="footer__dot" />
                <span className="footer__dot" />
            </div>
        </footer>
    )
}

export default HomeFooter