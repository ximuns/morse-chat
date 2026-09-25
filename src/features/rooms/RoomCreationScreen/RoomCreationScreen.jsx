import RoomCreationForm from './components/RoomCreationForm/RoomCreationForm'
import RoomCreationHeader from './components/RoomCreationHeader/RoomCreationHeader'

import './RoomCreationScreen.css'

function RoomCreationScreen({ onBack, onCreated }) {
  return (
    <div className="room-creation">
      <RoomCreationHeader onBack={onBack} />

      <RoomCreationForm onCreated={onCreated} />
    </div>
  )
}

export default RoomCreationScreen
