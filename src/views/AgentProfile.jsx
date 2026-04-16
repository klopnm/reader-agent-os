import { motion } from 'framer-motion'
import { Zap, BookOpen, Target, Cpu, BarChart2 } from 'lucide-react'
import { agent } from '../data/agentData'

export default function AgentProfile() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto p-6 space-y-6">

        {/* Header banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative glass rounded-xl p-6 overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-neon-faint to-transparent" />
          <div className="absolute top-0 right-0 w-48 h-48 bg-neon-green/5 rounded-full blur-3xl" />

          <div className="relative flex items-start gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-xl border-2 border-neon-green/40 bg-slate-dark flex items-center justify-center animate-glow-pulse">
                <div className="w-14 h-14 rounded-lg border border-neon-green/30 bg-neon-faint flex flex-col items-center justify-center gap-1">
                  <Cpu size={20} className="text-neon-green" style={{ filter: 'drop-shadow(0 0 6px #00ff41)' }} />
                  <div className="text-[8px] font-mono text-neon-green/60 tracking-widest">AI</div>
                </div>
              </div>
              <span className="status-dot absolute -bottom-1 -right-1" />
            </div>

            {/* Identity */}
            <div className="flex-1">
              <div className="section-label mb-1">DESIGNATION</div>
              <h1 className="text-3xl font-bold font-mono neon-text tracking-widest">[{agent.codename}]</h1>
              <p className="text-xs font-mono text-neon-green/50 mt-0.5">{agent.designation}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="tag">STATUS: {agent.status}</span>
                <span className="tag">v{agent.version}</span>
                <span className="tag info">SOLANA NATIVE</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bio */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="wiki-card space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen size={13} className="text-neon-green/70" />
              <span className="section-label">OPERATIVE PROFILE</span>
            </div>
            <p className="text-sm font-mono text-neon-green/70 leading-relaxed">{agent.bio}</p>
            <hr className="divider" />
            <div className="section-label mb-2">ORIGIN</div>
            <p className="text-sm font-mono text-neon-green/60 leading-relaxed">{agent.origin}</p>
          </div>
        </motion.div>

        {/* Capabilities */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="wiki-card">
            <div className="flex items-center gap-2 mb-4">
              <Target size={13} className="text-neon-green/70" />
              <span className="section-label">CORE CAPABILITIES</span>
            </div>
            <div className="space-y-2">
              {agent.traits.map((trait, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.06 }}
                  className="flex items-center gap-3 py-2 border-b border-neon-green/5 last:border-0"
                >
                  <span className="text-neon-green text-[10px] font-mono">▶</span>
                  <span className="text-xs font-mono text-neon-green/75">{trait}</span>
                  <div className="ml-auto h-1 w-24 bg-slate-mid rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${75 + i * 5}%` }}
                      transition={{ delay: 0.4 + i * 0.08, duration: 0.6, ease: 'easeOut' }}
                      className="h-full bg-neon-green/70 rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="wiki-card">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 size={13} className="text-neon-green/70" />
              <span className="section-label">PERFORMANCE METRICS</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Object.entries(agent.stats).map(([key, val], i) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 + i * 0.07 }}
                  className="p-3 rounded bg-void border border-neon-green/10"
                >
                  <div className="section-label mb-1">{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</div>
                  <div className="text-lg font-bold font-mono text-neon-green neon-text">{val}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Lore quote */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <div className="text-center py-4">
            <div className="text-[10px] font-mono text-neon-green/25 tracking-widest mb-2">// OPERATIVE CREED //</div>
            <p className="text-sm font-mono text-neon-green/50 italic">{agent.quote}</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
