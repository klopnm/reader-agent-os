import { motion } from 'framer-motion'
import { TrendingUp, Shield, Activity, Zap, AlertTriangle, ArrowRight } from 'lucide-react'
import { agent, mockFeedData } from '../data/agentData'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.35 } }),
}

function StatCard({ label, value, sub, accent = false }) {
  return (
    <div className="wiki-card flex flex-col gap-1">
      <div className="section-label">{label}</div>
      <div className={`text-2xl font-bold font-mono ${accent ? 'neon-text' : 'text-neon-green/80'}`}>
        {value}
      </div>
      {sub && <div className="text-[11px] font-mono text-neon-green/40">{sub}</div>}
    </div>
  )
}

function RiskBadge({ risk }) {
  const map = {
    low: 'bg-neon-faint border-neon-green/30 text-neon-green',
    medium: 'bg-warn/10 border-warn/30 text-warn',
    high: 'bg-danger/10 border-danger/30 text-danger',
    critical: 'bg-danger/20 border-danger/50 text-danger animate-pulse',
  }
  return (
    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase tracking-wider ${map[risk] || map.low}`}>
      {risk}
    </span>
  )
}

export default function Dashboard({ setActiveView }) {
  const recentAlerts = mockFeedData.filter(f => f.type === 'alert').slice(0, 3)

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto p-6 space-y-6">

        {/* Header */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
          <div className="section-label mb-1">OPERATIVE DASHBOARD</div>
          <h1 className="text-xl font-bold font-mono text-neon-green neon-text tracking-wide">
            Welcome back, Operative.
          </h1>
          <p className="text-xs font-mono text-neon-green/40 mt-1">
            {new Date().toUTCString()} // All systems nominal
          </p>
        </motion.div>

        {/* Agent quote */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show">
          <div className="glass rounded-lg p-4 border-l-2 border-neon-green/60">
            <div className="text-[10px] font-mono text-neon-green/40 mb-1">READER SAYS</div>
            <p className="text-sm font-mono text-neon-green/80 italic">{agent.quote}</p>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show"
          className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="CALLS ANALYZED" value={agent.stats.callsAnalyzed.toLocaleString()} accent />
          <StatCard label="RUGS DETECTED" value={agent.stats.rugsDetected.toLocaleString()} sub="prevented losses" />
          <StatCard label="ACCURACY" value={`${agent.stats.accuracy}%`} sub="7-day rolling" />
          <StatCard label="ALPHA CALLS" value={agent.stats.alphaGenerated} sub="this month" />
        </motion.div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Live alerts */}
          <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show">
            <div className="wiki-card h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={13} className="text-danger" />
                  <span className="text-xs font-mono font-semibold text-neon-green/80">ACTIVE ALERTS</span>
                </div>
                <span className="status-dot danger" />
              </div>
              <div className="space-y-3">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-2.5 rounded bg-void/60 border border-danger/10">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-neon-green">${alert.token}</span>
                        <RiskBadge risk={alert.risk} />
                      </div>
                      <p className="text-[11px] font-mono text-neon-green/50 leading-relaxed">
                        {alert.description}
                      </p>
                      <div className="text-[10px] font-mono text-neon-green/30 mt-1">
                        MC: {alert.mcap} // {alert.time} ago
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActiveView('feed')}
                className="mt-3 w-full text-[11px] font-mono text-neon-green/40 hover:text-neon-green flex items-center justify-center gap-1 transition-colors"
              >
                VIEW LIVE FEED <ArrowRight size={10} />
              </button>
            </div>
          </motion.div>

          {/* Quick access modules */}
          <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show"
            className="grid grid-rows-3 gap-3">
            {[
              { icon: TrendingUp, label: 'MARKET INTEL', sub: 'Bonding curve analysis & volume tracking', view: 'market' },
              { icon: Zap, label: 'TRADING STRATEGIES', sub: '3-3-3 framework, migration sniping, copy trading', view: 'strategies' },
              { icon: Shield, label: 'CONTRACT AUDITS', sub: 'Rug pull detection & LP lock verification', view: 'audits' },
            ].map(({ icon: Icon, label, sub, view }) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className="wiki-card flex items-center gap-4 text-left group"
              >
                <div className="w-9 h-9 rounded border border-neon-green/20 bg-neon-faint flex items-center justify-center group-hover:border-neon-green/50 transition-all shrink-0">
                  <Icon size={15} className="text-neon-green/70 group-hover:text-neon-green transition-colors" />
                </div>
                <div>
                  <div className="text-xs font-mono font-semibold text-neon-green/80 group-hover:text-neon-green transition-colors">
                    {label}
                  </div>
                  <div className="text-[10px] font-mono text-neon-green/35 leading-relaxed">{sub}</div>
                </div>
                <ArrowRight size={12} className="ml-auto text-neon-green/20 group-hover:text-neon-green/60 transition-all group-hover:translate-x-0.5" />
              </button>
            ))}
          </motion.div>
        </div>

        {/* Feed preview */}
        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="show">
          <div className="wiki-card">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={13} className="text-neon-green" />
              <span className="text-xs font-mono font-semibold text-neon-green/80">PUMP.FUN FEED PREVIEW</span>
              <span className="ml-auto flex items-center gap-1 text-[10px] font-mono text-neon-green/40">
                <span className="status-dot" style={{ width: 5, height: 5 }} />
                LIVE
              </span>
            </div>
            <div className="space-y-1.5">
              {mockFeedData.slice(0, 4).map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-[11px] font-mono py-1.5 border-b border-neon-green/5 last:border-0">
                  <span className="text-neon-green/25 shrink-0 w-14">{item.time}</span>
                  <span className={`shrink-0 w-16 ${
                    item.type === 'alert' ? 'text-danger' :
                    item.type === 'graduation' ? 'text-info' : 'text-neon-green/60'
                  }`}>{item.type.toUpperCase()}</span>
                  <span className="font-bold text-neon-green shrink-0 w-20">${item.token}</span>
                  <span className="text-neon-green/40 shrink-0">{item.mcap}</span>
                  <RiskBadge risk={item.risk} />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
