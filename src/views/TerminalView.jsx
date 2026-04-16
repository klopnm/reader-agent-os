import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Maximize2, Minimize2 } from 'lucide-react'
import CliTerminal from '../components/CliTerminal'

export default function TerminalView() {
  const [minimized, setMinimized] = useState(false)

  return (
    <div className="h-full flex flex-col overflow-hidden p-4 gap-4">
      {/* Info panel */}
      <div className="glass rounded-lg p-4 shrink-0">
        <div className="section-label mb-2">OPERATIVE TERMINAL</div>
        <p className="text-xs font-mono text-neon-green/55 leading-relaxed">
          Direct command interface for on-chain analysis and agent queries. Use{' '}
          <code className="text-neon-green bg-neon-faint px-1 rounded">help</code> to list all available commands.
          Connect to a live RPC endpoint for real-time blockchain data.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
          {[
            { cmd: 'scan <mint>', desc: 'Analyze token' },
            { cmd: 'wallet <addr>', desc: 'Profile deployer' },
            { cmd: 'risk <mint>', desc: 'Risk score' },
            { cmd: 'stats', desc: 'Agent metrics' },
          ].map(({ cmd, desc }) => (
            <div key={cmd} className="p-2 rounded bg-void border border-neon-green/10">
              <div className="text-[10px] font-mono text-neon-green font-bold">{cmd}</div>
              <div className="text-[9px] font-mono text-neon-green/40">{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Terminal */}
      <div className="flex-1 terminal-container rounded-lg overflow-hidden flex flex-col">
        <CliTerminal minimized={minimized} setMinimized={setMinimized} />
      </div>
    </div>
  )
}
