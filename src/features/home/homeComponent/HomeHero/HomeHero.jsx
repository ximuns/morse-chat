import './HomeHero.css'

// import CreateRoom from '../../rooms/CreateRoom/CreateRoom'
// import JoinRoom from '../../rooms/JoinRoom/JoinRoom'

function HomeHero() {
    return (
        <section className="hero">
            <div className="hero__content">
                <div className="hero__title">
                    <span>MORSE</span>
                    <span>CHAT</span>
                </div>

                <div className="hero__description">
                    НАСТОЯЩИЕ ЛЮДИ.<br />
                    РЕАЛЬНОЕ ОБЩЕНИЕ.<br />
                    ТОЛЬКО МОРЗЕ.
                </div>
            </div>

            <div className="hero__actions">
                {/* <CreateRoom />
                <JoinRoom /> */}
            </div>
        </section>
    )
}

export default HomeHero