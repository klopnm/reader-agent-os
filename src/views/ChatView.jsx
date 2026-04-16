import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Cpu, User } from 'lucide-react'
import { agent } from '../data/agentData'

const READER_RESPONSES = [
  "I've seen this pattern before. The deployer wallet is fresh, but the buy distribution looks coordinated. I'm flagging it — proceed with caution.",
  "The bonding curve metrics look organic so far. Volume is distributed across 47 unique wallets in the last 10 minutes. Could be early momentum.",
  "Cross-referencing the mint address... three prior launches from this deployer. Two graduated. One rug at 78% curve. Risk score: 6.2/10.",
  "LP is unlocked. That's the biggest red flag here. Even if the chart looks clean, an unlocked pool means the dev can exit without warning.",
  "I'm detecting coordinated wallet clusters in the top buyers. Wallets 3, 7, and 12 in the buy sequence share a funding source. This is a bundle.",
  "The social metrics are lagging the price — that's actually a bullish sign. Organic pumps typically see sentiment follow the chart, not lead it.",
  "My training includes post-mortems from 2,341 rugged projects. This setup shares 4 of the 7 key signatures I associate with coordinated exits.",
  "Interesting. The supply distribution is unusually clean for a sub-$5K cap. Either this is genuinely organic or someone is very good at obscuring it.",
]

let responseIdx = 0

function getReaderResponse() {
  const r = READER_RESPONSES[responseIdx % READER_RESPONSES.length]
  responseIdx++
  return r
}

export default function ChatView() {
  const [messages, setMessages] = useState([
    {
      id: 0, role: 'reader',
      text: `Operative. I'm online.\n\nI'm [READER] — your on-chain intelligence asset. Feed me a mint address, a token name, or a strategy question. I'll tell you what I see in the data.\n\nWhat are we analyzing today?`,
      time: new Date().toLocaleTimeString(),
    }
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  const send = async (e) => {
    e.preventDefault()
    if (!input.trim() || thinking) return

    const userMsg = {
      id: Date.now(), role: 'user',
      text: input.trim(),
      time: new Date().toLocaleTimeString(),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setThinking(true)

    await new Promise(r => setTimeout(r, 900 + Math.random() * 800))

    const readerMsg = {
      id: Date.now() + 1, role: 'reader',
      text: getReaderResponse(),
      time: new Date().toLocaleTimeString(),
    }
    setMessages(prev => [...prev, readerMsg])
    setThinking(false)
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-neon-green/10 bg-slate-dark/40 shrink-0">
        <div className="relative">
          <div className="w-8 h-8 rounded border border-neon-green/40 bg-neon-faint flex items-center justify-center">
            <Cpu size={13} className="text-neon-green" />
          </div>
          <span className="status-dot absolute -top-0.5 -right-0.5" />
        </div>
        <div>
          <div className="text-xs font-mono font-bold text-neon-green tracking-widest">[{agent.codename}]</div>
          <div className="text-[10px] font-mono text-neon-green/40">{agent.designation}</div>
        </div>
        <div className="ml-auto text-[10px] font-mono text-neon-green/30">
          ENCRYPTED CHANNEL // E2E
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-7 h-7 rounded border flex items-center justify-center shrink-0 mt-0.5
                ${msg.role === 'reader'
                  ? 'border-neon-green/40 bg-neon-faint'
                  : 'border-neon-green/20 bg-slate-mid'
                }`}>
                {msg.role === 'reader'
                  ? <Cpu size={11} className="text-neon-green" />
                  : <User size={11} className="text-neon-green/50" />
                }
              </div>

              {/* Bubble */}
              <div className={`max-w-lg ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div className={`text-[10px] font-mono ${msg.role === 'reader' ? 'text-neon-green/40' : 'text-neon-green/30'}`}>
                  {msg.role === 'reader' ? '[READER]' : 'OPERATIVE'} · {msg.time}
                </div>
                <div className={`rounded-lg px-4 py-3 text-xs font-mono leading-relaxed whitespace-pre-wrap
                  ${msg.role === 'reader'
                    ? 'glass border-neon-green/15 text-neon-green/80'
                    : 'bg-slate-mid border border-neon-green/10 text-neon-green/60'
                  }`}>
                  {msg.text}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Thinking indicator */}
          {thinking && (
            <motion.div
              key="thinking"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-3"
            >
              <div className="w-7 h-7 rounded border border-neon-green/40 bg-neon-faint flex items-center justify-center shrink-0">
                <Cpu size={11} className="text-neon-green" />
              </div>
              <div className="glass border-neon-green/15 rounded-lg px-4 py-3 flex items-center gap-1">
                {[0, 1, 2].map(i => (
                  <motion.span
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
                    className="w-1.5 h-1.5 rounded-full bg-neon-green"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={send}
        className="flex items-center gap-3 px-5 py-3 border-t border-neon-green/10 bg-slate-dark/40 shrink-0"
      >
        <div className="flex-1 flex items-center gap-2 glass rounded-lg px-4 py-2.5">
          <span className="text-neon-green/30 text-xs font-mono shrink-0">&gt;</span>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask Reader anything... token address, strategy, risk analysis"
            className="flex-1 bg-transparent text-xs font-mono text-neon-green/80 outline-none placeholder:text-neon-green/20 caret-neon-green"
          />
        </div>
        <motion.button
          type="submit"
          disabled={!input.trim() || thinking}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="neon-btn p-2.5 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Send size={13} />
        </motion.button>
      </form>
    </div>
  )
}
