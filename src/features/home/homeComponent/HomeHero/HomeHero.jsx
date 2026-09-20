import RoomButton from '../../../rooms/RoomButton/RoomButton'
import './HomeHero.css'


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
                <RoomButton>
                    СОЗДАТЬ КОМНАТУ
                </RoomButton>

                <RoomButton>
                    ВОЙТИ В КОМНАТУ
                </RoomButton>
            </div>
        </section>
    )
}

export default HomeHero