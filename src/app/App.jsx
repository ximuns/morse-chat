import './App.css'

import HomeScreen from '../features/home/HomeScreen'
import Top from '../backgound/Top/Top'
import Bottom from '../backgound/Bottom/Bottom'

function App() {
    return (
        <main className="page">
            <Bottom />
            <Top />

            <HomeScreen />
        </main>
    )
}

export default App