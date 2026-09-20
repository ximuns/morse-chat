import HomeFooter from './homeComponent/HomeFooter/HomeFooter'
import HomeHeader from './homeComponent/HomeHeader/HomeHeader'
import HomeHero from './homeComponent/HomeHero/HomeHero'
import './HomeScreen.css'


function HomeScreen() {
    return (
        <div className="home-screen">
            <HomeHeader />
            <HomeHero />
            <HomeFooter />
        </div>
    )
}

export default HomeScreen