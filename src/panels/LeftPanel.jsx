import { useState, useEffect, useRef } from 'react'
import { mockFeedData } from '../data/agentData'

// ─── Clock ────────────────────────────────────────────────────────────────────
function getCycleInfo(h) {
  if (h >= 6  && h < 12) return { id: 'learning', label: 'LEARNING',  range: '06:00–12:00' }
  if (h >= 12 && h < 18) return { id: 'scanning', label: 'SCANNING',  range: '12:00–18:00' }
  if (h >= 18 && h < 24) return { id: 'hunting',  label: 'HUNTING',   range: '18:00–00:00' }
  return                          { id: 'dormant',  label: 'DORMANT',   range: '00:00–06:00' }
}

const CYCLES = [
  {
    id: 'learning', label: 'LEARNING', time: '06:00–12:00',
    desc: 'Pattern ingestion',
    sub: ['Scanning archived launches', 'Cross-referencing wallet clusters'],
  },
  {
    id: 'scanning', label: 'SCANNING', time: '12:00–18:00',
    desc: 'Active monitoring',
    sub: ['Live pump.fun surveillance', 'Risk scoring new tokens'],
  },
  {
    id: 'hunting', label: 'HUNTING', time: '18:00–00:00',
    desc: 'Deployer tracking',
    sub: ['Flagged wallet monitoring', 'Exit signal detection'],
  },
  {
    id: 'dormant', label: 'DORMANT', time: '00:00–06:00',
    desc: 'Memory consolidation',
    sub: ['Neural archive updates', 'Pattern library expansion'],
  },
]

// ─── Feed helpers ─────────────────────────────────────────────────────────────
const RISK_COLOR = { low: 'var(--accent)', medium: 'var(--warn)', high: 'var(--danger)', critical: 'var(--danger)' }
const TYPE_LABEL = { launch: 'LAUNCH', graduation: 'GRAD', alert: 'ALERT' }
const TYPE_COLOR = { launch: 'var(--accent)', graduation: 'var(--info)', alert: 'var(--danger)' }

const TOKENS_POOL = ['NXUS', 'VOID', 'KIRA', 'ECHO', 'FLUX', 'NOVA', 'HALO', 'ZION', 'REKT', 'PUMP']
const TYPES_POOL  = ['launch', 'launch', 'launch', 'alert', 'graduation']
const RISKS_POOL  = ['low', 'low', 'medium', 'high', 'critical']

// ─── LeftPanel ────────────────────────────────────────────────────────────────
export default function LeftPanel() {
  const [now, setNow]     = useState(new Date())
  const [feed, setFeed]   = useState(mockFeedData.slice(0, 12))
  const [playing, setPlaying] = useState(false)
  const feedRef = useRef(null)

  // Clock tick
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  // Live feed simulation
  useEffect(() => {
    const id = setInterval(() => {
      const token = TOKENS_POOL[Math.floor(Math.random() * TOKENS_POOL.length)]
      const type  = TYPES_POOL[Math.floor(Math.random() * TYPES_POOL.length)]
      const risk  = RISKS_POOL[Math.floor(Math.random() * RISKS_POOL.length)]
      setFeed(prev => [{
        id: Date.now(), type, time: '00:00:01',
        token, mint: `${Math.random().toString(36).slice(2,6)}...`, mcap: `$${(Math.random()*60+1).toFixed(1)}K`,
        risk, bondingCurve: Math.floor(Math.random() * 100),
        isNew: true,
      }, ...prev.slice(0, 29)])
    }, 3800)
    return () => clearInterval(id)
  }, [])

  const h    = now.getHours()
  const cycle = getCycleInfo(h)
  const timeStr = now.toLocaleTimeString('en-US', { hour12: false })
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

  return (
    <div
      className="os-panel flex flex-col border-r overflow-hidden"
      style={{ width: 258, minWidth: 258, height: '100%' }}
    >
      {/* ── Clock ─────────────────────────────────────────── */}
      <div className="os-section">
        <div style={{ fontSize: 28, letterSpacing: '0.06em', color: 'var(--text)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
          {timeStr}
        </div>
        <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, color: 'var(--dim)' }}>{dateStr}</span>
          <span style={{
            fontSize: 9, color: 'var(--accent)', background: 'var(--glow)',
            border: '1px solid rgba(0,255,65,0.3)', padding: '1px 6px', borderRadius: 2,
            letterSpacing: '0.12em',
          }}>
            {cycle.label}
          </span>
        </div>
      </div>

      {/* ── Day Cycle ─────────────────────────────────────── */}
      <div className="os-section" style={{ paddingBottom: 8 }}>
        <div className="os-label" style={{ marginBottom: 8 }}>Reader's Cycle</div>
        {CYCLES.map(c => {
          const active = c.id === cycle.id
          return (
            <div key={c.id} style={{ marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 1 }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                  background: active ? 'var(--accent)' : 'var(--border)',
                  boxShadow: active ? '0 0 6px var(--accent)' : 'none',
                  transition: 'all 0.3s',
                }} />
                <span style={{ fontSize: 10, color: active ? 'var(--accent)' : 'var(--dim)', letterSpacing: '0.08em' }}>
                  {c.label}
                </span>
                <span style={{ fontSize: 9, color: 'var(--border)', marginLeft: 'auto' }}>
                  {c.time}
                </span>
              </div>
              {active && (
                <div style={{ paddingLeft: 13 }}>
                  <div style={{ fontSize: 9, color: 'var(--dim)', marginBottom: 2 }}>{c.desc}</div>
                  {c.sub.map(s => (
                    <div key={s} style={{ fontSize: 9, color: 'var(--border)', paddingLeft: 8 }}>
                      › {s}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Live Feed ─────────────────────────────────────── */}
      <div className="os-section" style={{ padding: '8px 0 0', display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <div style={{ padding: '0 12px 6px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="live-dot" />
          <span className="os-label" style={{ letterSpacing: '0.16em' }}>LIVE</span>
          <span style={{ fontSize: 9, color: 'var(--dim)', marginLeft: 4 }}>pump.fun</span>
          <span style={{ fontSize: 9, color: 'var(--border)', marginLeft: 'auto' }}>{feed.length} events</span>
        </div>
        <div
          ref={feedRef}
          style={{ overflowY: 'auto', flex: 1 }}
        >
          {feed.map((item, i) => (
            <div
              key={item.id ?? i}
              className="feed-item"
              style={{
                opacity: item.isNew ? 1 : 0.85,
                animation: item.isNew ? 'fadeIn 0.35s ease' : 'none',
              }}
            >
              <span style={{ fontSize: 9, color: TYPE_COLOR[item.type] ?? 'var(--dim)', width: 38, flexShrink: 0 }}>
                {TYPE_LABEL[item.type]}
              </span>
              <span style={{ fontWeight: 600, color: 'var(--text)', fontSize: 10, width: 52, flexShrink: 0 }}>
                ${item.token}
              </span>
              <span style={{ fontSize: 9, color: 'var(--dim)', flex: 1 }}>{item.mcap}</span>
              <span style={{ fontSize: 9, color: RISK_COLOR[item.risk] ?? 'var(--dim)', flexShrink: 0 }}>
                {item.risk?.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Lo-Fi Radio ───────────────────────────────────── */}
      <div className="os-section" style={{ flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
          <span className="os-label">Lo-Fi Radio</span>
          <span style={{ fontSize: 8, color: 'var(--dim)', background: 'var(--glow)', padding: '1px 5px', border: '1px solid var(--border)', borderRadius: 2 }}>
            Reader's Pick
          </span>
        </div>
        <div style={{ fontSize: 10, color: 'var(--text)', marginBottom: 2 }}>Midnight Protocol</div>
        <div style={{ fontSize: 9, color: 'var(--dim)', marginBottom: 7 }}>Synthwave · Lo-Fi</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            className="os-btn"
            style={{ padding: '3px 10px', fontSize: 10 }}
            onClick={() => setPlaying(p => !p)}
          >
            {playing ? '⏸' : '▶'}
          </button>
          <div style={{ flex: 1, height: 2, background: 'var(--border)', borderRadius: 1, position: 'relative' }}>
            <div style={{ width: '38%', height: '100%', background: 'rgba(0,255,65,0.5)', borderRadius: 1 }} />
          </div>
          <span style={{ fontSize: 9, color: 'var(--dim)' }}>2:14</span>
        </div>
      </div>
    </div>
  )
}
