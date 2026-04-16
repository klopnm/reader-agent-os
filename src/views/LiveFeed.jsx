import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Filter, AlertTriangle, Rocket, Trophy } from 'lucide-react'
import { mockFeedData } from '../data/agentData'

function FeedItem({ item, isNew }) {
  const typeConfig = {
    launch: { icon: Rocket, color: 'text-neon-green', label: 'LAUNCH' },
    graduation: { icon: Trophy, color: 'text-info', label: 'GRAD' },
    alert: { icon: AlertTriangle, color: 'text-danger', label: 'ALERT' },
  }
  const cfg = typeConfig[item.type] || typeConfig.launch
  const Icon = cfg.icon

  const riskColor = {
    low: 'text-neon-green border-neon-green/25',
    medium: 'text-warn border-warn/25',
    high: 'text-danger border-danger/30',
    critical: 'text-danger border-danger/50 animate-pulse',
  }

  return (
    <motion.div
      initial={isNew ? { opacity: 0, x: 20, backgroundColor: '#00ff4111' } : { opacity: 1 }}
      animate={{ opacity: 1, x: 0, backgroundColor: 'transparent' }}
      transition={{ duration: 0.35 }}
      className="flex items-center gap-3 px-4 py-3 border-b border-neon-green/5 hover:bg-neon-faint/30 transition-colors group"
    >
      {/* Type icon */}
      <div className={`shrink-0 ${cfg.color}`}>
        <Icon size={12} />
      </div>

      {/* Time */}
      <span className="text-[10px] font-mono text-neon-green/25 w-14 shrink-0">{item.time}</span>

      {/* Type label */}
      <span className={`text-[9px] font-mono w-12 shrink-0 ${cfg.color}`}>{cfg.label}</span>

      {/* Token */}
      <span className="text-xs font-mono font-bold text-neon-green w-20 shrink-0">${item.token}</span>

      {/* Mint */}
      <span className="text-[10px] font-mono text-neon-green/30 w-20 shrink-0 hidden sm:block">{item.mint}</span>

      {/* MC */}
      <span className="text-[11px] font-mono text-neon-green/60 w-16 shrink-0">{item.mcap}</span>

      {/* Bonding curve */}
      <div className="hidden md:flex items-center gap-2 w-24 shrink-0">
        <div className="flex-1 h-1 bg-slate-mid rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${item.bondingCurve}%`,
              background: item.bondingCurve >= 80 ? '#00aaff' : item.bondingCurve >= 50 ? '#ffaa00' : '#00ff41',
            }}
          />
        </div>
        <span className="text-[9px] font-mono text-neon-green/35">{item.bondingCurve}%</span>
      </div>

      {/* Risk */}
      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase tracking-wider ml-auto shrink-0 ${riskColor[item.risk]}`}>
        {item.risk}
      </span>
    </motion.div>
  )
}

export default function LiveFeed() {
  const [filter, setFilter] = useState('all')
  const [feed, setFeed] = useState(mockFeedData)
  const [counter, setCounter] = useState(0)

  // Simulate new incoming data
  useEffect(() => {
    const tokens = ['CYBER', 'VOID', 'PULSE', 'ECHO', 'NOVA', 'FLUX', 'DELTA', 'OMEGA']
    const types = ['launch', 'alert', 'graduation']
    const risks = ['low', 'low', 'medium', 'high', 'critical']

    const interval = setInterval(() => {
      const token = tokens[Math.floor(Math.random() * tokens.length)]
      const type = types[Math.floor(Math.random() * types.length)]
      const risk = risks[Math.floor(Math.random() * risks.length)]
      const mcap = `$${(Math.random() * 60 + 1).toFixed(1)}K`
      setCounter(c => c + 1)
      setFeed(prev => [{
        id: Date.now(),
        type, time: '00:00:01',
        token, mint: `${Math.random().toString(36).slice(2, 6)}...${Math.random().toString(36).slice(2, 6)}`,
        mcap, deployer: 'FRESH', risk,
        bondingCurve: Math.floor(Math.random() * 100),
        description: type === 'alert' ? 'Anomalous activity detected' : type === 'graduation' ? 'Bonding curve completed' : 'New token launched',
        isNew: true,
      }, ...prev.slice(0, 29)])
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  const filtered = filter === 'all' ? feed : feed.filter(f => f.type === filter)

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-neon-green/10 bg-slate-dark/40 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity size={14} className="text-neon-green" />
            <span className="text-sm font-mono font-semibold text-neon-green/80">LIVE FEED</span>
            <span className="flex items-center gap-1 text-[10px] font-mono text-neon-green/40">
              <span className="status-dot" style={{ width: 5, height: 5 }} /> STREAMING
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-neon-green/40">
            <span>{counter} new events</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mt-3">
          <Filter size={10} className="text-neon-green/30" />
          {['all', 'launch', 'graduation', 'alert'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-[10px] font-mono px-2.5 py-1 rounded border transition-all
                ${filter === f
                  ? 'border-neon-green/50 bg-neon-faint text-neon-green'
                  : 'border-neon-green/10 text-neon-green/35 hover:border-neon-green/30 hover:text-neon-green/60'
                }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Column headers */}
        <div className="flex items-center gap-3 px-0 py-2 mt-2 text-[9px] font-mono text-neon-green/25 tracking-widest border-t border-neon-green/5">
          <span className="w-4 shrink-0" />
          <span className="w-14 shrink-0">TIME</span>
          <span className="w-12 shrink-0">TYPE</span>
          <span className="w-20 shrink-0">TOKEN</span>
          <span className="w-20 shrink-0 hidden sm:block">MINT</span>
          <span className="w-16 shrink-0">MCAP</span>
          <span className="w-24 shrink-0 hidden md:block">CURVE</span>
          <span className="ml-auto shrink-0">RISK</span>
        </div>
      </div>

      {/* Feed list */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence initial={false}>
          {filtered.map((item) => (
            <FeedItem key={item.id} item={item} isNew={item.isNew} />
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="flex items-center justify-center h-32 text-xs font-mono text-neon-green/30">
            NO EVENTS MATCHING FILTER
          </div>
        )}
      </div>
    </div>
  )
}
