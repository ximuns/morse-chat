import './RoomButton.css'

function RoomButton({ children, onClick }) {
  return (
    <button className="room-button" type="button" onClick={onClick}>
      <span className="room-button__content">
        <span className="room-button__title">{children}</span>

        <span className="room-button__arrow">→</span>
      </span>
    </button>
  )
}

export default RoomButton
