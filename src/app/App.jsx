import './App.css'

import Top from '../backgound/Top/Top'
import Bottom from '../backgound/Bottom/Bottom'
import ScreenRouter from './navigation/ScreenRouter'

function App() {
  return (
    <main className="page">
      <Bottom />
      <Top />
      <ScreenRouter />
    </main>
  )
}

export default App
