import { useState, useRef, useEffect } from 'react'
import {
  User, TrendingUp, Crosshair, Shield, Activity,
  BarChart2, Layers, Terminal, BookOpen, Settings,
} from 'lucide-react'
import { agent } from '../data/agentData'

// ─── App definitions ──────────────────────────────────────────────────────────
const APPS = [
  { id: 'profile',     icon: User,       label: 'Profile'   },
  { id: 'market',      icon: TrendingUp, label: 'Market'    },
  { id: 'strategy',    icon: Crosshair,  label: 'Strategy'  },
  { id: 'audit',       icon: Shield,     label: 'Audit'     },
  { id: 'feed',        icon: Activity,   label: 'Feed'      },
  { id: 'stats',       icon: BarChart2,  label: 'Stats'     },
  { id: 'tokenomics',  icon: Layers,     label: 'Token'     },
  { id: 'terminal',    icon: Terminal,   label: 'Terminal'  },
  { id: 'wiki',        icon: BookOpen,   label: 'Wiki'      },
  { id: 'settings',    icon: Settings,   label: 'Settings'  },
]

// ─── App content renderers ────────────────────────────────────────────────────
function Row({ label, value, cls }) {
  return (
    <div className="ct-row">
      <span className="label">{label}</span>
      <span className={`value ${cls ?? ''}`}>{value}</span>
    </div>
  )
}
function Rule() { return <hr className="ct-rule" /> }
function P({ children }) { return <p className="ct-p">{children}</p> }
function Item({ children, active }) {
  return <div className={`ct-item ${active ? 'active' : ''}`}>{children}</div>
}

const CONTENT = {
  profile: () => (
    <>
      <div className="ct-title">[READER] // OPERATIVE CLASS AI</div>
      <Rule />
      <P>{agent.bio}</P>
      <Rule />
      <div className="os-label" style={{ marginBottom: 5 }}>Traits</div>
      {agent.traits.map(t => <Item key={t} active>{t.split(' //')[0]}</Item>)}
      <Rule />
      <Row label="VERSION"  value={`v${agent.version}`} />
      <Row label="ACCURACY" value={`${agent.stats.accuracy}%`} cls="up" />
      <Row label="UPTIME"   value={agent.stats.uptime} cls="up" />
      <Rule />
      <P style={{ fontStyle: 'italic', color: 'var(--dim)' }}>{agent.quote}</P>
    </>
  ),

  market: () => (
    <>
      <div className="ct-title">MARKET INTEL // SOLANA</div>
      <Rule />
      <div className="os-label" style={{ marginBottom: 5 }}>Bonding Curve</div>
      <P>Pump.fun uses an AMM where price increases as tokens are bought. Migration triggers at $69K market cap → Raydium DEX.</P>
      <div style={{ padding: '6px 8px', background: 'rgba(0,255,65,0.04)', border: '1px solid var(--border)', borderRadius: 2, marginBottom: 8 }}>
        <span style={{ fontSize: 9, color: 'var(--dim)' }}>FORMULA </span>
        <span style={{ fontSize: 10, color: 'var(--accent)' }}>P(x) = k / (S − x)</span>
      </div>
      <Item active>Initial price: near zero</Item>
      <Item active>Each buy → exponential increase</Item>
      <Item active>Migration at ~$69K market cap</Item>
      <Item active>Early entry = best risk/reward</Item>
      <Rule />
      <div className="os-label" style={{ marginBottom: 5 }}>Deployer Profiling</div>
      <P>Every deployer leaves an on-chain fingerprint. Cross-reference SOL balance, prior launches, and wallet cluster funding.</P>
      <Item>Fresh wallet = unknown risk</Item>
      <Item>Check associated wallet clusters</Item>
      <Item>Prior rug history is permanent</Item>
      <Rule />
      <div className="os-label" style={{ marginBottom: 5 }}>Volume Analysis</div>
      <P>Organic volume shows distributed buys across unique wallets. Wash trading: few wallets cycling funds with no net change.</P>
    </>
  ),

  strategy: () => (
    <>
      <div className="ct-title">TRADING STRATEGIES</div>
      <Rule />
      <div className="os-label" style={{ marginBottom: 5 }}>The 3-3-3 Framework</div>
      <P>Allocate max 3% per play. Take profit at 3x. Never hold past 3x without a thesis update. Discipline over conviction.</P>
      <Row label="MAX POSITION" value="3% portfolio" />
      <Row label="PROFIT TARGET" value="3× entry" cls="up" />
      <Row label="STOP LOSS"    value="−50%" cls="dn" />
      <Rule />
      <div className="os-label" style={{ marginBottom: 5 }}>Early Migration Sniping</div>
      <P>Monitor tokens approaching 100% bonding curve completion. Position 10–15 min before graduation for Raydium liquidity event.</P>
      <Row label="ENTRY WINDOW" value="80–95% curve" />
      <Row label="RISK"         value="HIGH" cls="dn" />
      <Rule />
      <div className="os-label" style={{ marginBottom: 5 }}>Deployer Copy Trading</div>
      <P>Track verified deployers with 3+ successful graduations. Mirror new launches within 60s. Set hard stop at −50%.</P>
      <Row label="SIGNAL"    value="Deployer launch" />
      <Row label="ENTRY"     value="&lt; 60s after deploy" />
      <Row label="STOP LOSS" value="−50%" cls="dn" />
    </>
  ),

  audit: () => (
    <>
      <div className="ct-title">CONTRACT AUDIT // CHECKLIST</div>
      <Rule />
      {[
        { label: 'Mint authority revoked',      pass: true,  risk: 'CRITICAL' },
        { label: 'Freeze authority revoked',    pass: true,  risk: 'CRITICAL' },
        { label: 'Liquidity pool locked',       pass: false, risk: 'HIGH' },
        { label: 'Top 10 wallets < 30% supply', pass: true,  risk: 'HIGH' },
        { label: 'Contract verified on-chain',  pass: true,  risk: 'MEDIUM' },
        { label: 'Deployer < 5 prior launches', pass: false, risk: 'MEDIUM' },
        { label: 'No bundled launch detected',  pass: true,  risk: 'HIGH' },
        { label: 'Social links active',         pass: true,  risk: 'LOW' },
      ].map(c => (
        <div key={c.label} className="ct-row" style={{ padding: '2.5px 0' }}>
          <span style={{ color: c.pass ? 'var(--accent)' : 'var(--danger)', marginRight: 6 }}>
            {c.pass ? '✓' : '✗'}
          </span>
          <span className="label" style={{ flex: 1 }}>{c.label}</span>
          <span style={{ fontSize: 9, color: c.risk === 'CRITICAL' || c.risk === 'HIGH' ? 'var(--danger)' : c.risk === 'MEDIUM' ? 'var(--warn)' : 'var(--dim)' }}>
            {c.risk}
          </span>
        </div>
      ))}
      <Rule />
      <div className="os-label" style={{ marginBottom: 5 }}>Rug Pull Vectors</div>
      <Item>Freeze Authority — dev freezes all transfers</Item>
      <Item>Mint Authority — infinite supply dilution</Item>
      <Item>Unlocked LP — instant liquidity removal</Item>
      <Item>Insider Supply — coordinated dump</Item>
    </>
  ),

  feed: () => (
    <>
      <div className="ct-title">PUMP.FUN FEED // STATS</div>
      <Rule />
      <P>Live feed is streaming in the left panel. Below: session summary.</P>
      <Rule />
      <div className="os-label" style={{ marginBottom: 5 }}>Today's Activity</div>
      <Row label="NEW LAUNCHES"  value="847" />
      <Row label="GRADUATED"     value="12"  cls="up" />
      <Row label="RUGS DETECTED" value="23"  cls="dn" />
      <Row label="ALPHA CALLS"   value="4"   cls="up" />
      <Rule />
      <div className="os-label" style={{ marginBottom: 5 }}>Risk Distribution</div>
      {[['LOW', '54%', 'up'], ['MEDIUM', '28%', ''], ['HIGH', '14%', 'dn'], ['CRITICAL', '4%', 'dn']].map(([k,v,c]) => (
        <div key={k} className="ct-row">
          <span className="label">{k}</span>
          <div style={{ flex: 1, height: 2, background: 'var(--border)', margin: '0 8px', borderRadius: 1, alignSelf: 'center' }}>
            <div style={{ width: v, height: '100%', background: c === 'up' ? 'var(--accent)' : c === 'dn' ? 'var(--danger)' : 'var(--warn)', borderRadius: 1 }} />
          </div>
          <span className={`value ${c}`}>{v}</span>
        </div>
      ))}
    </>
  ),

  stats: () => (
    <>
      <div className="ct-title">AGENT STATISTICS // v{agent.version}</div>
      <Rule />
      <Row label="CALLS ANALYZED"   value={agent.stats.callsAnalyzed.toLocaleString()} cls="up" />
      <Row label="RUGS DETECTED"    value={agent.stats.rugsDetected.toLocaleString()} />
      <Row label="ALPHA CALLS"      value={agent.stats.alphaGenerated} cls="up" />
      <Row label="ACCURACY RATE"    value={`${agent.stats.accuracy}%`} cls="up" />
      <Row label="UPTIME"           value={agent.stats.uptime} cls="up" />
      <Rule />
      <div className="os-label" style={{ marginBottom: 5 }}>Last 24h</div>
      <Item active>142 new tokens scanned</Item>
      <Item active>18 alerts generated</Item>
      <Item>3 graduated calls</Item>
      <Item>1 rug prevented</Item>
      <Rule />
      <div className="os-label" style={{ marginBottom: 5 }}>Performance Trend</div>
      {[['Week 1', '91.2%'], ['Week 2', '92.8%'], ['Week 3', '93.5%'], ['Week 4', '94.7%']].map(([w, v]) => (
        <div key={w} className="ct-row">
          <span className="label">{w}</span>
          <div style={{ flex: 1, height: 2, background: 'var(--border)', margin: '0 8px', borderRadius: 1, alignSelf: 'center' }}>
            <div style={{ width: v, height: '100%', background: 'var(--accent)', borderRadius: 1 }} />
          </div>
          <span className="value up">{v}</span>
        </div>
      ))}
    </>
  ),

  tokenomics: () => (
    <>
      <div className="ct-title">$READER // TOKENOMICS</div>
      <Rule />
      <Row label="STATUS"   value="TBA" />
      <Row label="NETWORK"  value="Solana" />
      <Row label="PLATFORM" value="Pump.fun" />
      <Row label="CA"       value="—" />
      <Rule />
      <div className="os-label" style={{ marginBottom: 5 }}>Distribution</div>
      <Row label="TEAM"       value="0% (fair launch)" />
      <Row label="LP"         value="100% burned" cls="up" />
      <Row label="DEV WALLET" value="0 SOL" cls="up" />
      <Row label="TAX"        value="None" cls="up" />
      <Rule />
      <div style={{ padding: '6px 8px', borderLeft: '2px solid rgba(0,255,65,0.3)', marginTop: 4 }}>
        <P>"Fair launch. No presale. No team allocation. Just the chart."</P>
      </div>
    </>
  ),

  terminal: () => (
    <>
      <div className="ct-title">CLI // COMMAND REFERENCE</div>
      <Rule />
      {[
        ['scan &lt;mint&gt;',       'Analyze token contract'],
        ['wallet &lt;address&gt;',  'Profile deployer wallet'],
        ['risk &lt;mint&gt;',       'Generate risk score 0–100'],
        ['feed',                    'Live feed summary'],
        ['stats',                   'Agent statistics'],
        ['clear',                   'Clear terminal output'],
        ['help',                    'List all commands'],
      ].map(([cmd, desc]) => (
        <div key={cmd} className="ct-row" style={{ padding: '2px 0' }}>
          <span dangerouslySetInnerHTML={{ __html: cmd }} style={{ color: 'var(--accent)', fontSize: 10 }} />
          <span className="label" style={{ textAlign: 'right' }}>{desc}</span>
        </div>
      ))}
      <Rule />
      <P>Use the bottom terminal bar for the interactive CLI. Commands support ↑↓ history navigation.</P>
    </>
  ),

  wiki: () => (
    <>
      <div className="ct-title">KNOWLEDGE BASE // READER WIKI</div>
      <Rule />
      <div className="os-label" style={{ marginBottom: 5 }}>Sections</div>
      <Item active>Bonding Curve Theory</Item>
      <Item active>Deployer Fingerprinting</Item>
      <Item active>Volume Analysis Methods</Item>
      <Item active>Rug Pull Taxonomy</Item>
      <Item>Exit Strategy Design</Item>
      <Item>On-chain Forensics</Item>
      <Item>Smart Money Tracking</Item>
      <Rule />
      <P>"Everything I know was learned from watching others lose. That knowledge now protects you."</P>
      <Rule />
      <div className="os-label" style={{ marginBottom: 5 }}>Sources</div>
      <Row label="TRAINING DATA" value="12,847 launches" />
      <Row label="RUG CASES"     value="2,341 analyzed" />
      <Row label="LAST UPDATED"  value="v2.4.1" />
    </>
  ),

  settings: null, // handled inline
}

// ─── Settings content (needs props) ──────────────────────────────────────────
function SettingsContent({ settings, setSettings }) {
  const toggle = k => setSettings(s => ({ ...s, [k]: !s[k] }))
  const rows = [
    { key: 'particles',  label: 'Particles'   },
    { key: 'autoRotate', label: 'Auto-Rotate'  },
    { key: 'dialogue',   label: 'Dialogue'     },
    { key: 'scanBeam',   label: 'Scan Beam'    },
  ]
  return (
    <>
      <div className="ct-title">SYSTEM SETTINGS</div>
      <Rule />
      <div className="os-label" style={{ marginBottom: 6 }}>Scene</div>
      {rows.map(({ key, label }) => (
        <div key={key} className="ct-row" style={{ padding: '3px 0' }}>
          <span className="label">{label}</span>
          <button
            className="os-btn"
            style={settings[key] ? { color: 'var(--accent)', borderColor: 'rgba(0,255,65,0.5)' } : {}}
            onClick={() => toggle(key)}
          >
            [{settings[key] ? '●' : '○'}] {settings[key] ? 'ON' : 'OFF'}
          </button>
        </div>
      ))}
      <Rule />
      <div className="os-label" style={{ marginBottom: 6 }}>Network</div>
      <Row label="RPC"     value="Helius (demo)" />
      <Row label="NETWORK" value="Mainnet" cls="up" />
      <Row label="LATENCY" value="43ms" cls="up" />
    </>
  )
}

// ─── Compact chat ─────────────────────────────────────────────────────────────
const READER_REPLIES = [
  "The chart doesn't lie. The deployer's history does.",
  "Cross-referencing the mint... 2 prior rugs from this deployer. Caution.",
  "LP is unlocked. That's the biggest red flag here. Exit plan ready?",
  "Organic volume confirmed across 47 wallets. Early momentum looks real.",
  "I've seen this pattern before — coordinated wallets, 3 and 7 in the buy sequence share a funding source.",
  "Risk score: 72/100. Elevated. Dev wallet still active on-chain.",
  "Bonding curve at 67%. Watching for acceleration. Could graduate in 4 minutes.",
  "Volume spike without social lag — classic insider run. Don't chase.",
]
let replyIdx = 0

export default function RightPanel({ settings, setSettings }) {
  const [activeApp, setActiveApp] = useState('profile')
  const [visible,   setVisible]   = useState(true)
  const [messages,  setMessages]  = useState([
    { id: 0, from: 'reader', text: "I'm online. What are we analyzing?", time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) },
  ])
  const [input,     setInput]     = useState('')
  const [typing,    setTyping]    = useState(false)
  const [online]                  = useState(7)
  const msgRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    msgRef.current?.scrollTo({ top: 9999, behavior: 'smooth' })
  }, [messages, typing])

  const selectApp = (id) => {
    setVisible(false)
    setTimeout(() => { setActiveApp(id); setVisible(true) }, 140)
  }

  const sendMsg = async e => {
    e.preventDefault()
    if (!input.trim() || typing) return
    const t = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    setMessages(prev => [...prev, { id: Date.now(), from: 'user', text: input.trim(), time: t }])
    setInput('')
    setTyping(true)
    await new Promise(r => setTimeout(r, 900 + Math.random() * 700))
    const reply = READER_REPLIES[replyIdx % READER_REPLIES.length]; replyIdx++
    const t2 = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    setMessages(prev => [...prev, { id: Date.now() + 1, from: 'reader', text: reply, time: t2 }])
    setTyping(false)
  }

  const renderContent = () => {
    if (activeApp === 'settings') return <SettingsContent settings={settings} setSettings={setSettings} />
    const fn = CONTENT[activeApp]
    return fn ? fn() : null
  }

  return (
    <div
      className="os-panel flex flex-col border-l overflow-hidden"
      style={{ width: 248, minWidth: 248, height: '100%' }}
    >
      {/* ── Header ────────────────────────────────────────── */}
      <div className="os-section" style={{ padding: '8px 10px 6px', flexShrink: 0 }}>
        <div style={{ fontSize: 10, color: 'var(--text)', letterSpacing: '0.15em', marginBottom: 1 }}>APP EXPLORER</div>
        <div style={{ fontSize: 9, color: 'var(--dim)' }}>Modules &amp; Tools</div>
      </div>

      {/* ── Apps grid ─────────────────────────────────────── */}
      <div style={{ padding: '6px 8px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1 }}>
          {APPS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              className={`app-btn ${activeApp === id ? 'active' : ''}`}
              onClick={() => selectApp(id)}
            >
              <Icon size={13} style={{ color: activeApp === id ? 'var(--accent)' : 'var(--dim)' }} />
              <span className="app-label">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Online bar ────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '4px 10px', borderBottom: '1px solid var(--border)',
        fontSize: 9, flexShrink: 0,
      }}>
        <span className="live-dot" style={{ width: 4, height: 4 }} />
        <span style={{ color: 'var(--dim)' }}>{online} online</span>
        <span style={{ color: 'var(--border)', marginLeft: 'auto' }}>0 msgs</span>
      </div>

      {/* ── App content ───────────────────────────────────── */}
      <div
        style={{
          flex: 1, overflowY: 'auto', padding: 10,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.14s ease',
        }}
      >
        {renderContent()}
      </div>

      {/* ── Chat ──────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        {/* Messages */}
        <div
          ref={msgRef}
          style={{ maxHeight: 148, overflowY: 'auto', padding: '6px 10px' }}
        >
          {messages.map(m => (
            <div key={m.id} className="chat-msg">
              <span className="time">{m.time}</span>
              <span className="name" style={{ color: m.from === 'reader' ? 'var(--accent)' : 'var(--info)' }}>
                {m.from === 'reader' ? '[READER]' : 'you'}
              </span>
              <span style={{ color: 'var(--dim)', marginLeft: 6 }}>{m.text}</span>
            </div>
          ))}
          {typing && (
            <div className="chat-msg">
              <span className="name" style={{ color: 'var(--accent)' }}>[READER]</span>
              {[0,1,2].map(i => (
                <span key={i} style={{ display: 'inline-block', width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)', margin: '0 2px', verticalAlign: 'middle', animation: `livePulse 1s ${i*0.25}s ease-in-out infinite` }} />
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={sendMsg}
          style={{ display: 'flex', alignItems: 'center', borderTop: '1px solid var(--border)' }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask Reader anything..."
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              fontSize: 10, color: 'var(--text)', padding: '7px 10px',
              fontFamily: 'inherit',
            }}
          />
          <button
            type="submit"
            style={{
              background: 'none', border: 'none', borderLeft: '1px solid var(--border)',
              padding: '7px 10px', color: 'var(--dim)', fontSize: 11,
              transition: 'color 0.15s', cursor: 'pointer',
            }}
            onMouseEnter={e => e.target.style.color = 'var(--accent)'}
            onMouseLeave={e => e.target.style.color = 'var(--dim)'}
          >
            ➤
          </button>
        </form>
      </div>
    </div>
  )
}
