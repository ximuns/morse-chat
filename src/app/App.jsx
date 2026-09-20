import './App.css'

// import MorseScene from '../background/MorseScene'
import HomeScreen from '../features/home/HomeScreen'
import Top from '../backgound/Top/Top'

function App() {
    return (
        <main className="page">
            {/* <MorseScene /> */}
            <Top />

            <HomeScreen />
        </main>
    )
}

export default App