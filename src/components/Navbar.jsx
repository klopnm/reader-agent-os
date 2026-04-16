import { useState, useEffect } from 'react'

export default function Navbar({ settings, setSettings, walletConnected, setWalletConnected }) {
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const toggle = (key) => setSettings(s => ({ ...s, [key]: !s[key] }))

  return (
    <div
      className="os-panel flex items-center border-b shrink-0"
      style={{ height: 38, padding: '0 12px', gap: 18 }}
    >
      {/* Brand */}
      <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.22em', color: 'var(--accent)', whiteSpace: 'nowrap' }}>
        [READER]
      </span>

      {/* Nav links */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        {['Docs', 'Feed', 'Wiki', 'Contract'].map(l => (
          <a key={l} href="#" className="os-link" onClick={e => e.preventDefault()}>
            {l}
          </a>
        ))}
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Clock */}
      <span style={{ fontSize: 10, color: 'var(--dim)', letterSpacing: '0.08em', fontVariantNumeric: 'tabular-nums', minWidth: 64 }}>
        {time}
      </span>

      {/* Network */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <span className="live-dot" />
        <span style={{ fontSize: 9, color: 'var(--dim)', letterSpacing: '0.08em' }}>SOL:MAINNET</span>
      </div>

      {/* LIVE badge */}
      <span style={{
        fontSize: 9, fontWeight: 700, background: 'var(--accent)', color: '#000',
        padding: '2px 5px', borderRadius: 2, letterSpacing: '0.1em',
      }}>
        LIVE
      </span>

      {/* Toggle buttons */}
      <button
        className={`os-btn ${settings.particles ? 'active' : ''}`}
        onClick={() => toggle('particles')}
      >
        Particles {settings.particles ? 'On' : 'Off'}
      </button>
      <button
        className={`os-btn ${settings.dialogue ? 'active' : ''}`}
        onClick={() => toggle('dialogue')}
      >
        Dialogue {settings.dialogue ? 'On' : 'Off'}
      </button>

      {/* Wallet */}
      {walletConnected ? (
        <button
          className="os-btn active"
          onClick={() => setWalletConnected(false)}
          style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          7xKf...3nBq
        </button>
      ) : (
        <button
          className="os-btn"
          onClick={() => setWalletConnected(true)}
          style={{ color: 'var(--accent)', borderColor: 'rgba(0,255,65,0.4)' }}
        >
          Connect Wallet
        </button>
      )}
    </div>
  )
}
