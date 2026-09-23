import RoomCreationForm from './components/RoomCreationForm/RoomCreationForm'
import RoomCreationHeader from './components/RoomCreationHeader/RoomCreationHeader'
import './RoomCreationScreen.css'

function RoomCreationScreen({ onBack }) {
  return (
    <div className="room-creation">
      <RoomCreationHeader onBack={onBack} />
      <RoomCreationForm />
    </div>
  )
}

export default RoomCreationScreen
