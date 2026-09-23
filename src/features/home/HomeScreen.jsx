import HomeFooter from './homeComponent/HomeFooter/HomeFooter'
import HomeHeader from './homeComponent/HomeHeader/HomeHeader'
import HomeHero from './homeComponent/HomeHero/HomeHero'

import './HomeScreen.css'

function HomeScreen({ onCreateRoom, onJoinRoom, onAbout, onRooms }) {
  return (
    <div className="home-screen">
      <HomeHeader onAbout={onAbout} onRooms={onRooms} />
      <HomeHero onCreateRoom={onCreateRoom} onJoinRoom={onJoinRoom} />
      <HomeFooter />
    </div>
  )
}

export default HomeScreen
