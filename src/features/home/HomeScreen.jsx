import HomeFooter from './homeComponent/HomeFooter/HomeFooter'
import HomeHeader from './homeComponent/HomeHeader/HomeHeader'
import HomeHero from './homeComponent/HomeHero/HomeHero'

import './HomeScreen.css'


function HomeScreen({
    onCreateRoom,
    onJoinRoom,
}) {

    return (
        <div className="home-screen">
            <HomeHeader />
            <HomeHero
                onCreateRoom={
                    onCreateRoom
                }
                onJoinRoom={
                    onJoinRoom
                }
            />
            <HomeFooter />
        </div>
    )
}


export default HomeScreen