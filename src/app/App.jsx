import './App.css'

import Top from '../backgound/Top/Top'
import Bottom from '../backgound/Bottom/Bottom'
import ScreenRouter from './navigation/ScreenRouter'
import { AuthProvider } from '../state/auth/AuthProvider'

function App() {
  return (
    <AuthProvider>
      <main className="page">
        <Bottom />
        <Top />
        <ScreenRouter />
      </main>
    </AuthProvider>
  )
}

export default App