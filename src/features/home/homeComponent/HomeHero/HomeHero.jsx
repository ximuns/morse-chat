import JoinRoom from '../../../rooms/JoinRoom/JoinRoom'
import RoomButton from '../../../rooms/RoomButton/RoomButton'
import './HomeHero.css'

function HomeHero({ onCreateRoom, onJoinRoom }) {
  return (
    <section className="hero">
      <div className="hero__content">
        <div className="hero__title">
          <span>MORSE</span>
          <span>CHAT</span>
        </div>

        <div className="hero__description">
          НАСТОЯЩИЕ ЛЮДИ.
          <br />
          РЕАЛЬНОЕ ОБЩЕНИЕ.
          <br />
          ТОЛЬКО МОРЗЕ.
        </div>
      </div>

      <div className="hero__actions">
        <RoomButton onClick={onCreateRoom}>СОЗДАТЬ КОМНАТУ</RoomButton>

        <JoinRoom onJoin={onJoinRoom} />
      </div>
    </section>
  )
}

export default HomeHero
