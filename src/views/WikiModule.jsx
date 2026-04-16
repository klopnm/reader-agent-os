import { motion } from 'framer-motion'
import { TrendingUp, Crosshair, Shield, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { wikiModules } from '../data/agentData'

const sectionConfig = {
  market: {
    icon: TrendingUp,
    title: 'MARKET INTEL',
    subtitle: 'On-chain intelligence & market structure analysis',
  },
  strategies: {
    icon: Crosshair,
    title: 'TRADING STRATEGIES',
    subtitle: 'Proven frameworks for the Solana trenches',
  },
  audits: {
    icon: Shield,
    title: 'CONTRACT AUDITS',
    subtitle: 'Rug detection, LP analysis, and contract risk scoring',
  },
}

const auditChecklist = [
  { item: 'Mint authority revoked', risk: 'critical', pass: true },
  { item: 'Freeze authority revoked', risk: 'critical', pass: true },
  { item: 'Liquidity pool locked', risk: 'high', pass: false },
  { item: 'Top 10 wallets < 30% supply', risk: 'high', pass: true },
  { item: 'Contract verified on-chain', risk: 'medium', pass: true },
  { item: 'Deployer < 5 prior launches', risk: 'medium', pass: false },
  { item: 'No bundled launch detected', risk: 'high', pass: true },
  { item: 'Social links active', risk: 'low', pass: true },
]

function AuditView() {
  return (
    <div className="space-y-5">
      <div className="wiki-card">
        <div className="section-label mb-3">AUDIT CHECKLIST TEMPLATE</div>
        <p className="text-xs font-mono text-neon-green/55 mb-4 leading-relaxed">
          Run this checklist before entering any position. Red flags indicate potential rug vectors.
          This is a simulated example — use live RPC data for real audits.
        </p>
        <div className="space-y-2">
          {auditChecklist.map((check, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between py-2 border-b border-neon-green/5 last:border-0"
            >
              <div className="flex items-center gap-3">
                <span className={`text-sm ${check.pass ? 'text-neon-green' : 'text-danger'}`}>
                  {check.pass ? '✓' : '✗'}
                </span>
                <span className="text-xs font-mono text-neon-green/70">{check.item}</span>
              </div>
              <span className={`tag ${check.risk === 'critical' ? 'danger' : check.risk === 'high' ? 'danger' : check.risk === 'medium' ? 'warn' : ''}`}>
                {check.risk}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="wiki-card">
        <div className="section-label mb-3">RUG PULL VECTORS</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: 'Freeze Authority', desc: 'Dev can freeze all token transfers, preventing sales' },
            { title: 'Mint Authority', desc: 'Infinite token supply can dilute existing holders' },
            { title: 'Unlocked LP', desc: 'Dev can remove liquidity pool at any time' },
            { title: 'Insider Supply', desc: 'Top wallets coordinating a dump at target price' },
          ].map(({ title, desc }) => (
            <div key={title} className="p-3 rounded bg-void border border-danger/10">
              <div className="text-xs font-mono text-danger mb-1">{title}</div>
              <div className="text-[11px] font-mono text-neon-green/45 leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function WikiCard({ data, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="wiki-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-3 text-left"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-mono font-semibold text-neon-green/85">{data.title}</span>
            {data.tag && <span className="tag">{data.tag}</span>}
            {data.risk && (
              <span className={`tag ${data.risk === 'high' ? 'danger' : data.risk === 'medium' ? 'warn' : ''}`}>
                RISK: {data.risk.toUpperCase()}
              </span>
            )}
          </div>
        </div>
        <span className="text-neon-green/40 shrink-0 mt-0.5">
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </span>
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 pt-3 border-t border-neon-green/10 space-y-3"
        >
          <p className="text-xs font-mono text-neon-green/60 leading-relaxed">{data.content}</p>

          {data.formula && (
            <div className="p-3 rounded bg-void border border-neon-green/15 font-mono text-xs text-neon-green/70">
              <span className="text-neon-green/30 text-[10px]">FORMULA // </span>
              {data.formula}
            </div>
          )}

          {data.keyPoints && (
            <ul className="space-y-1.5">
              {data.keyPoints.map((pt, i) => (
                <li key={i} className="flex items-center gap-2 text-xs font-mono text-neon-green/55">
                  <span className="text-neon-green/40 text-[10px]">▶</span>
                  {pt}
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default function WikiModule({ section }) {
  const cfg = sectionConfig[section] || sectionConfig.market
  const Icon = cfg.icon
  const items = wikiModules[section] || wikiModules.market

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto p-6 space-y-5">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded border border-neon-green/30 bg-neon-faint flex items-center justify-center">
              <Icon size={14} className="text-neon-green" />
            </div>
            <div>
              <div className="section-label">{cfg.title}</div>
              <h2 className="text-lg font-bold font-mono text-neon-green/85">{cfg.subtitle}</h2>
            </div>
          </div>
          <hr className="divider mt-3" />
        </motion.div>

        {/* Content */}
        {section === 'audits' ? (
          <AuditView />
        ) : (
          <div className="space-y-3">
            {items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <WikiCard data={item} defaultOpen={i === 0} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Reader insight */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
          <div className="glass rounded-lg p-4 border-l-2 border-neon-green/40">
            <div className="section-label mb-2">READER'S INSIGHT</div>
            <p className="text-xs font-mono text-neon-green/60 leading-relaxed">
              {section === 'market' && 'Every move on-chain is a tell. The liquidity doesn\'t lie — the narrative does. Cross-reference everything before you enter.'}
              {section === 'strategies' && 'The best trade you never take is the one that saves your stack. Patience is a strategy. The trenches reward the disciplined.'}
              {section === 'audits' && 'A clean audit doesn\'t mean a safe play. It means fewer known vectors. Stay paranoid, stay solvent.'}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
