import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, X } from 'lucide-react'

const COMMANDS = {
  help: () => [
    '  Available commands:',
    '  scan <mint>       — Analyze token contract',
    '  wallet <address>  — Profile deployer wallet',
    '  risk <mint>       — Generate risk score',
    '  feed              — Show live feed summary',
    '  stats             — Display agent statistics',
    '  clear             — Clear terminal',
    '  help              — Show this message',
  ],
  stats: () => [
    '  READER // Agent Statistics',
    '  ─────────────────────────────',
    '  Accuracy Rate       : 94.7%',
    '  Tokens Analyzed     : 12,847',
    '  Rugs Detected       : 2,341',
    '  Alpha Calls         : 438',
    '  Uptime              : 99.9%',
    '  Model Version       : 2.4.1',
  ],
  feed: () => [
    '  Live Feed // Last 60s',
    '  ─────────────────────────────',
    '  [00:00:03]  LAUNCH    KIRA         $4.2K  [MEDIUM]',
    '  [00:01:12]  GRADUATE  NEXUS        $69K   [LOW]',
    '  [00:02:47]  ALERT     RKTCAT       $18K   [HIGH]',
    '  [00:03:05]  LAUNCH    SOLARPUNK    $1.1K  [LOW]',
    '  [00:04:33]  ALERT     MOONDOG      $31K   [CRITICAL]',
  ],
  clear: () => null,
}

function processCommand(raw) {
  const [cmd, ...args] = raw.trim().toLowerCase().split(/\s+/)
  if (cmd === 'clear') return null

  if (COMMANDS[cmd]) return COMMANDS[cmd](args)

  if (cmd === 'scan' || cmd === 'wallet' || cmd === 'risk') {
    if (!args[0]) return [`  ERROR: Missing argument. Usage: ${cmd} <address>`]
    return [
      `  > Querying on-chain data for ${args[0]}...`,
      `  > Scanning contract bytecode...`,
      `  > Cross-referencing deployer history...`,
      `  `,
      `  ⚠  SIMULATED OUTPUT — Connect to live RPC for real data`,
      `  Risk Score : ${Math.floor(Math.random() * 100)}/100`,
      `  Deployer   : ${Math.random() > 0.5 ? 'FRESH WALLET' : 'FLAGGED — 2 prior rugs'}`,
      `  LP Status  : ${Math.random() > 0.5 ? 'LOCKED (90d)' : 'UNLOCKED — HIGH RISK'}`,
    ]
  }

  if (cmd === '') return []
  return [`  bash: ${cmd}: command not found. Type 'help' for available commands.`]
}

export default function CliTerminal({ minimized, setMinimized }) {
  const [history, setHistory] = useState([
    { type: 'system', text: 'READER OS v2.4.1 // RESTRICTED ACCESS TERMINAL' },
    { type: 'system', text: 'Type "help" for available commands.' },
    { type: 'spacer' },
  ])
  const [input, setInput] = useState('')
  const [cmdHistory, setCmdHistory] = useState([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const submit = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const newHistory = [...history, { type: 'input', text: input }]
    const result = processCommand(input)

    if (result === null) {
      setHistory([{ type: 'system', text: 'Terminal cleared.' }])
    } else {
      const lines = result.map(t => ({ type: 'output', text: t }))
      setHistory([...newHistory, ...lines, { type: 'spacer' }])
    }

    setCmdHistory(prev => [input, ...prev])
    setHistoryIdx(-1)
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const idx = Math.min(historyIdx + 1, cmdHistory.length - 1)
      setHistoryIdx(idx)
      setInput(cmdHistory[idx] || '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const idx = Math.max(historyIdx - 1, -1)
      setHistoryIdx(idx)
      setInput(idx === -1 ? '' : cmdHistory[idx])
    }
  }

  return (
    <div className="flex flex-col h-full terminal-container rounded-none border-0 border-t border-neon-green/15">
      {/* Terminal titlebar */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b border-neon-green/10 bg-slate-dark cursor-pointer select-none"
        onClick={() => setMinimized(!minimized)}
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-danger/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-warn/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-neon-green/70" />
          </div>
          <span className="text-[10px] font-mono text-neon-green/50 tracking-widest ml-2">
            READER@MAINNET ~ $
          </span>
        </div>
        <button className="text-neon-green/30 hover:text-neon-green transition-colors">
          {minimized ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>

      <AnimatePresence>
        {!minimized && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col flex-1 overflow-hidden"
          >
            {/* Output */}
            <div
              className="flex-1 overflow-y-auto p-4 text-xs font-mono space-y-0.5"
              style={{ maxHeight: '160px' }}
              onClick={() => inputRef.current?.focus()}
            >
              {history.map((line, i) => (
                <div key={i}>
                  {line.type === 'spacer' ? (
                    <div className="h-1" />
                  ) : line.type === 'input' ? (
                    <div className="flex gap-2">
                      <span className="text-neon-green/50">reader@os:~$</span>
                      <span className="text-neon-green">{line.text}</span>
                    </div>
                  ) : line.type === 'system' ? (
                    <div className="text-neon-green/50">{line.text}</div>
                  ) : (
                    <div className="text-neon-green/75 whitespace-pre">{line.text}</div>
                  )}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={submit} className="flex items-center gap-2 px-4 py-2 border-t border-neon-green/10">
              <span className="text-neon-green/50 text-xs font-mono shrink-0">reader@os:~$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                spellCheck={false}
                className="flex-1 bg-transparent text-neon-green text-xs font-mono outline-none caret-neon-green placeholder:text-neon-green/20"
                placeholder="type a command..."
              />
              <span className="w-2 h-3.5 bg-neon-green animate-blink" />
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
