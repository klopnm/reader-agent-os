import { useState, useEffect } from 'react'

const STATUS_MSGS = [
  'ALL SYSTEMS NOMINAL',
  'NEURAL PATHWAYS ACTIVE',
  'PUMP.FUN FEED STREAMING',
  'PATTERN LIBRARY LOADED — 12,847 ENTRIES',
  'RPC CONNECTION STABLE',
  'SCAN BEAM CALIBRATED',
  'DEPLOYER DATABASE SYNCED',
]

export default function StatusBar() {
  const [msgIdx, setMsgIdx] = useState(0)
  const [block, setBlock] = useState(311_428_901)
  const [ping]  = useState(43)

  useEffect(() => {
    const id = setInterval(() => {
      setMsgIdx(i => (i + 1) % STATUS_MSGS.length)
      setBlock(b => b + Math.floor(Math.random() * 3 + 1))
    }, 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      className="os-panel flex items-center border-t shrink-0"
      style={{ height: 22, padding: '0 12px', gap: 16 }}
    >
      {/* Left — rolling status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
        <span className="live-dot" style={{ width: 4, height: 4 }} />
        <span style={{ fontSize: 9, color: 'var(--dim)', letterSpacing: '0.1em' }}>
          READER OS v2.4.1
        </span>
        <span style={{ color: 'var(--border)' }}>//</span>
        <span
          key={msgIdx}
          style={{ fontSize: 9, color: 'var(--dim)', letterSpacing: '0.05em', animation: 'fadeIn 0.4s ease' }}
        >
          {STATUS_MSGS[msgIdx]}
        </span>
      </div>

      {/* Center — divider */}
      <div style={{ width: 1, height: 12, background: 'var(--border)' }} />

      {/* Right — block + ping */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ fontSize: 9, color: 'var(--dim)', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.05em' }}>
          BLOCK: {block.toLocaleString()}
        </span>
        <span style={{ fontSize: 9, color: 'var(--dim)' }}>
          PING: <span style={{ color: 'var(--accent)' }}>{ping}ms</span>
        </span>
        <span style={{ fontSize: 9, color: 'var(--dim)' }}>
          UPTIME: <span style={{ color: 'var(--accent)' }}>99.9%</span>
        </span>
      </div>
    </div>
  )
}
