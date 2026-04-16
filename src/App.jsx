import { useState } from 'react'
import Navbar      from './components/Navbar'
import StatusBar   from './components/StatusBar'
import LeftPanel   from './panels/LeftPanel'
import RightPanel  from './panels/RightPanel'
import CharacterView from './views/CharacterView'

export default function App() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [settings, setSettings] = useState({
    particles:  true,
    autoRotate: true,
    dialogue:   true,
    scanBeam:   true,
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden', background: 'var(--bg)' }}>
      {/* CRT overlay */}
      <div className="scanlines" />

      {/* Top navbar */}
      <Navbar
        settings={settings}
        setSettings={setSettings}
        walletConnected={walletConnected}
        setWalletConnected={setWalletConnected}
      />

      {/* Three-column body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
        <LeftPanel />

        {/* Center — 3D character fills remaining space */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minWidth: 0 }}>
          <CharacterView settings={settings} />
        </div>

        <RightPanel settings={settings} setSettings={setSettings} />
      </div>

      {/* Bottom status bar */}
      <StatusBar />
    </div>
  )
}
