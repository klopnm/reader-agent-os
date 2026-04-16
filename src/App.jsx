import { useState, useEffect, useRef, useCallback } from 'react'
import { useProgress } from '@react-three/drei'
import Navbar        from './components/Navbar'
import StatusBar     from './components/StatusBar'
import LeftPanel     from './panels/LeftPanel'
import RightPanel    from './panels/RightPanel'
import CharacterView from './views/CharacterView'

// ─── Boot sequence lines ──────────────────────────────────────────────────────
const BOOT_LINES = [
  'BOOTING READER OS v2.4.1',
  'CONNECTING TO SOLANA MAINNET',
  'LOADING NEURAL NETWORK',
  'INITIALIZING 3D RENDERER',
  'DECRYPTING AGENT MATRIX',
]

// ─── Global loading overlay ───────────────────────────────────────────────────
function GlobalLoader({ progress, fading }) {
  const [blink, setBlink] = useState(true)
  const pct          = Math.floor(progress)
  const linesVisible = Math.ceil((pct / 100) * BOOT_LINES.length)
  const filled       = Math.round((pct / 100) * 28)
  const bar          = '█'.repeat(filled) + '░'.repeat(28 - filled)

  useEffect(() => {
    const id = setInterval(() => setBlink(b => !b), 530)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#0a0a0a',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: '"Courier New", Courier, monospace',
      userSelect: 'none',
      opacity:    fading ? 0 : 1,
      transition: 'opacity 0.9s ease',
      pointerEvents: fading ? 'none' : 'all',
    }}>
      {/* Brand */}
      <div style={{ marginBottom: 44, textAlign: 'center' }}>
        <div style={{
          fontSize: 30, fontWeight: 700, letterSpacing: '0.34em',
          color: '#00ff41',
          textShadow: '0 0 18px #00ff41, 0 0 36px rgba(0,255,65,0.25)',
        }}>
          R E A D E R
        </div>
        <div style={{ fontSize: 8, color: '#1c1c1c', letterSpacing: '0.22em', marginTop: 6 }}>
          AI AGENT OPERATING SYSTEM
        </div>
        <div style={{
          width: 220, height: 1, margin: '10px auto 0',
          background: 'linear-gradient(90deg, transparent, #00ff41, transparent)',
          opacity: 0.25,
        }} />
      </div>

      {/* Boot log */}
      <div style={{ width: 360, marginBottom: 30 }}>
        {BOOT_LINES.map((line, i) => {
          const isDone    = i < linesVisible - 1
          const isActive  = i === linesVisible - 1
          const isPending = i >= linesVisible
          return (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              fontSize: 10, padding: '3px 0',
              color: isPending ? '#1e1e1e' : isDone ? '#00cc34' : '#00ff41',
              letterSpacing: '0.05em',
              textShadow: isActive ? '0 0 8px #00ff41' : 'none',
            }}>
              <span>&gt;&nbsp;{line}</span>
              <span style={{ fontSize: 9, color: isDone ? '#00cc34' : 'transparent' }}>
                [ OK ]
              </span>
            </div>
          )
        })}
        <div style={{ fontSize: 11, color: '#00ff41', marginTop: 2, minHeight: 18 }}>
          {blink && linesVisible <= BOOT_LINES.length ? '█' : '\u00a0'}
        </div>
      </div>

      {/* Progress */}
      <div style={{ width: 360 }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          marginBottom: 7,
        }}>
          <span style={{ fontSize: 9, color: '#00ff41', letterSpacing: '0.16em' }}>
            INITIALIZING NEURAL PATHWAYS
          </span>
          <span style={{
            fontSize: 22, fontWeight: 700, color: '#00ff41',
            textShadow: '0 0 16px #00ff41',
          }}>
            {pct}<span style={{ fontSize: 11 }}>%</span>
          </span>
        </div>
        <div style={{ width: '100%', height: 2, background: '#111', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, height: '100%',
            width: `${pct}%`,
            background: '#00ff41',
            boxShadow: '0 0 8px #00ff41',
            transition: 'width 0.35s ease',
          }} />
        </div>
        <div style={{ fontSize: 8, color: '#1e1e1e', marginTop: 6, letterSpacing: '0.03em' }}>
          [{bar}]
        </div>
      </div>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const { progress } = useProgress()   // zustand store — works outside Canvas
  const mountTime    = useRef(Date.now())
  const [fading, setFading] = useState(false)
  const [gone,   setGone]   = useState(false)

  // Called by CharacterView when the 3D model finishes loading
  const handleLoaded = useCallback(() => {
    // Guarantee the boot screen is shown for at least 1.2 s
    const delay = Math.max(0, 1200 - (Date.now() - mountTime.current))
    setTimeout(() => setFading(true), delay)
    setTimeout(() => setGone(true),   delay + 900)
  }, [])

  const [walletConnected, setWalletConnected] = useState(false)
  const [settings, setSettings] = useState({
    particles:  true,
    autoRotate: true,
    dialogue:   true,
    scanBeam:   true,
  })

  return (
    <>
      {/* Global loader — position:fixed, z-index:9999, covers every panel */}
      {!gone && <GlobalLoader progress={progress} fading={fading} />}

      <div style={{
        display: 'flex', flexDirection: 'column',
        height: '100vh', width: '100vw',
        overflow: 'hidden', background: 'var(--bg)',
      }}>
        <div className="scanlines" />

        <Navbar
          settings={settings}
          setSettings={setSettings}
          walletConnected={walletConnected}
          setWalletConnected={setWalletConnected}
        />

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
          <LeftPanel />

          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minWidth: 0 }}>
            <CharacterView settings={settings} onLoaded={handleLoaded} />
          </div>

          <RightPanel settings={settings} setSettings={setSettings} />
        </div>

        <StatusBar />
      </div>
    </>
  )
}
