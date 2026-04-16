import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wallet, ChevronDown, Copy, ExternalLink, AlertTriangle } from 'lucide-react'

function truncate(addr) {
  return addr ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : ''
}

export default function TopBar({ activeView }) {
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddr] = useState('7xKf9mNp3bQr1aHj5vWx8dVs2mFy4jKo6cZq')
  const [balance] = useState('12.847')
  const [copied, setCopied] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const viewLabels = {
    dashboard: 'DASHBOARD', agent: 'AGENT PROFILE', feed: 'LIVE FEED',
    market: 'MARKET INTEL', strategies: 'TRADING STRATEGIES',
    audits: 'CONTRACT AUDITS', chat: 'CHAT // READER', terminal: 'TERMINAL',
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddr)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <header className="h-12 flex items-center justify-between px-5 border-b border-neon-green/10 bg-slate-dark/80 backdrop-blur-sm shrink-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono">
        <span className="text-neon-green/30">READER://</span>
        <span className="text-neon-green/60">/</span>
        <span className="text-neon-green neon-text tracking-widest">
          {viewLabels[activeView] || 'UNKNOWN'}
        </span>
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-3">
        {/* Network pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded border border-neon-green/15 bg-neon-faint text-[10px] font-mono text-neon-green/60">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-green shadow-neon-sm animate-pulse" />
          SOLANA MAINNET
        </div>

        {/* Wallet */}
        <div className="relative">
          {!walletConnected ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setWalletConnected(true)}
              className="neon-btn flex items-center gap-2 text-xs"
            >
              <Wallet size={12} />
              CONNECT WALLET
            </motion.button>
          ) : (
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded border border-neon-green/30 bg-neon-faint text-xs font-mono text-neon-green hover:border-neon-green/60 transition-all"
            >
              <Wallet size={11} className="text-neon-green" />
              <span className="hidden sm:inline">{truncate(walletAddr)}</span>
              <span className="text-neon-green/50 hidden sm:inline">|</span>
              <span className="hidden sm:inline font-bold">{balance} SOL</span>
              <ChevronDown size={10} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </motion.button>
          )}

          {/* Wallet dropdown */}
          {showDropdown && walletConnected && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute right-0 top-full mt-2 w-64 glass rounded-lg p-3 z-50 border border-neon-green/20"
            >
              <div className="text-[10px] font-mono text-neon-green/40 mb-2">CONNECTED WALLET</div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-mono text-neon-green/70">{truncate(walletAddr)}</span>
                <div className="flex gap-1">
                  <button onClick={handleCopy} className="p-1 hover:text-neon-green text-neon-green/40 transition-colors">
                    <Copy size={11} />
                  </button>
                  <button className="p-1 hover:text-neon-green text-neon-green/40 transition-colors">
                    <ExternalLink size={11} />
                  </button>
                </div>
              </div>
              {copied && <div className="text-[10px] text-neon-green font-mono mb-2">COPIED ✓</div>}
              <div className="text-lg font-bold font-mono text-neon-green neon-text mb-3">{balance} SOL</div>
              <hr className="divider mb-3" />
              <button
                onClick={() => { setWalletConnected(false); setShowDropdown(false) }}
                className="w-full text-xs font-mono text-danger/70 hover:text-danger transition-colors text-left flex items-center gap-2"
              >
                <AlertTriangle size={10} />
                DISCONNECT
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Click-outside overlay */}
      {showDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
      )}
    </header>
  )
}
