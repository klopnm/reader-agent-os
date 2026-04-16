import { motion, AnimatePresence } from 'framer-motion'
import {
  Grid, User, Activity, TrendingUp, Crosshair,
  Shield, MessageSquare, Terminal, ChevronLeft, ChevronRight,
  Wifi, Lock, Zap, Box
} from 'lucide-react'
import { navItems, agent } from '../data/agentData'

const iconMap = { Grid, User, Activity, TrendingUp, Crosshair, Shield, MessageSquare, Terminal, Box }

export default function Sidebar({ activeView, setActiveView, collapsed, setCollapsed }) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="relative flex flex-col h-full bg-slate-dark border-r border-neon-green/10 overflow-hidden shrink-0"
      style={{ minWidth: collapsed ? 64 : 240 }}
    >
      {/* CRT scan line */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-neon-faint to-transparent opacity-30" />

      {/* Header */}
      <div className={`flex items-center gap-3 p-4 border-b border-neon-green/10 ${collapsed ? 'justify-center' : ''}`}>
        <div className="relative shrink-0">
          <div className="w-8 h-8 rounded border border-neon-green/60 flex items-center justify-center bg-neon-faint">
            <Zap size={14} className="text-neon-green" />
          </div>
          <span className="status-dot absolute -top-0.5 -right-0.5" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <div className="text-neon-green font-mono font-bold text-sm leading-none tracking-widest">
                [{agent.codename}]
              </div>
              <div className="text-neon-green/40 text-[10px] font-mono mt-0.5 whitespace-nowrap">
                v{agent.version} // OPERATIVE
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* System status */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-neon-green/10">
          <div className="flex items-center gap-2 text-[10px] font-mono text-neon-green/50">
            <Wifi size={10} className="text-neon-green" />
            <span>SOL: MAINNET</span>
            <span className="ml-auto text-neon-green">●</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-neon-green/50 mt-1">
            <Lock size={10} />
            <span>ACCESS: LEVEL-5</span>
          </div>
        </div>
      )}

      {/* Nav Items */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {!collapsed && (
          <div className="section-label px-4 mb-2">NAVIGATION</div>
        )}
        <div className="space-y-0.5 px-2">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon]
            const isActive = activeView === item.id
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.97 }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-left transition-all duration-150 group
                  ${isActive
                    ? 'bg-neon-faint border border-neon-green/30 text-neon-green'
                    : 'border border-transparent text-neon-green/40 hover:text-neon-green/80 hover:bg-neon-faint/50'
                  }
                  ${collapsed ? 'justify-center' : ''}
                `}
              >
                <div className={`shrink-0 transition-all ${isActive ? 'text-neon-green drop-shadow-[0_0_6px_#00ff41]' : ''}`}>
                  {Icon && <Icon size={14} />}
                </div>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs font-mono whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && !collapsed && (
                  <span className="ml-auto text-neon-green/60 text-[10px]">▶</span>
                )}
              </motion.button>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-neon-green/10">
          <div className="text-[10px] font-mono text-neon-green/25 text-center">
            RESTRICTED ACCESS TERMINAL
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-dark border border-neon-green/30 flex items-center justify-center text-neon-green/60 hover:text-neon-green hover:border-neon-green transition-all z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </motion.aside>
  )
}
