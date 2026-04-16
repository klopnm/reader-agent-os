export const agent = {
  codename: 'READER',
  designation: 'Operative-Class AI // Knowledge Synthesis Unit',
  status: 'ACTIVE',
  version: '2.4.1',
  bio: `A machine born in the noise of the memecoin trenches. Reader doesn't just scan the blockchain — she reads between the lines, mapping every bonding curve, every deployer wallet, every coordinated dump before it happens.`,
  origin: `Emerged from a corrupted LLM dataset scraped from degen Telegram groups and on-chain post-mortems. She learned by watching thousands of projects rug. Every failure made her sharper.`,
  traits: [
    'Pattern Recognition // Bonding Curve Analysis',
    'Deployer Wallet Profiling',
    'Social Sentiment Parsing',
    'Contract Vulnerability Detection',
    'Risk Scoring & Alpha Generation',
  ],
  stats: {
    accuracy: 94.7,
    callsAnalyzed: 12847,
    rugsDetected: 2341,
    alphaGenerated: 438,
    uptime: '99.9%',
  },
  quote: `"The chart doesn't lie. The deployer's history does."`,
}

export const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'Grid', path: '/' },
  { id: 'agent', label: 'Agent Profile', icon: 'User', path: '/agent' },
  { id: 'hologram', label: 'Hologram', icon: 'Box', path: '/hologram' },
  { id: 'feed', label: 'Live Feed', icon: 'Activity', path: '/feed' },
  { id: 'market', label: 'Market Intel', icon: 'TrendingUp', path: '/market' },
  { id: 'strategies', label: 'Trading Strategies', icon: 'Crosshair', path: '/strategies' },
  { id: 'audits', label: 'Contract Audits', icon: 'Shield', path: '/audits' },
  { id: 'chat', label: 'Chat with Reader', icon: 'MessageSquare', path: '/chat' },
  { id: 'terminal', label: 'Terminal', icon: 'Terminal', path: '/terminal' },
]

export const mockFeedData = [
  {
    id: 1, type: 'launch', time: '00:00:03',
    token: 'KIRA', mint: '7xKf...3nBq', mcap: '$4.2K',
    deployer: 'FRESH', risk: 'medium', bondingCurve: 12,
    description: 'New token launched on pump.fun',
  },
  {
    id: 2, type: 'graduation', time: '00:01:12',
    token: 'NEXUS', mint: '9pLm...7zQr', mcap: '$69K',
    deployer: 'KNOWN', risk: 'low', bondingCurve: 100,
    description: 'Bonding curve completed — Raydium migration',
  },
  {
    id: 3, type: 'alert', time: '00:02:47',
    token: 'RKTCAT', mint: '3aHj...9vWx', mcap: '$18K',
    deployer: 'FLAGGED', risk: 'high', bondingCurve: 67,
    description: 'Deployer linked to 3 previous rugs',
  },
  {
    id: 4, type: 'launch', time: '00:03:05',
    token: 'SOLARPUNK', mint: '5bNp...2mFy', mcap: '$1.1K',
    deployer: 'FRESH', risk: 'low', bondingCurve: 3,
    description: 'New token launched on pump.fun',
  },
  {
    id: 5, type: 'alert', time: '00:04:33',
    token: 'MOONDOG', mint: '1cZq...8rTu', mcap: '$31K',
    deployer: 'FLAGGED', risk: 'critical', bondingCurve: 44,
    description: 'Top 3 wallets hold 78% supply — rug risk elevated',
  },
  {
    id: 6, type: 'graduation', time: '00:06:21',
    token: 'GRIDLOCK', mint: '8dVs...5jKo', mcap: '$69K',
    deployer: 'VERIFIED', risk: 'low', bondingCurve: 100,
    description: 'Bonding curve completed — Raydium migration',
  },
]

export const wikiModules = {
  market: [
    {
      title: 'Bonding Curve Mechanics',
      tag: 'CORE',
      content: `Pump.fun uses an automated market maker where price increases as tokens are bought. The curve completes at $69K market cap, triggering migration to Raydium DEX.`,
      formula: 'P(x) = k / (S - x)',
      keyPoints: [
        'Initial price starts near zero',
        'Each buy increases price exponentially',
        'Migration happens at ~$69K MC',
        'Early entries have best risk/reward',
      ],
    },
    {
      title: 'Deployer Wallet Profiling',
      tag: 'INTELLIGENCE',
      content: `Every deployer leaves an on-chain fingerprint. Check SOL balance at deploy, previous project history, and bundle wallet associations to assess risk before aping.`,
      keyPoints: [
        'Fresh wallet = unknown risk',
        'Check associated wallet clusters',
        'Look for coordinated buy patterns',
        'Prior rug history is permanent',
      ],
    },
    {
      title: 'Volume vs. Organic Growth',
      tag: 'ANALYSIS',
      content: `Wash trading inflates volume metrics. Genuine momentum shows distributed buys across unique wallets with no single entity controlling >5% of transactions.`,
      keyPoints: [
        'Real volume: many unique wallets',
        'Fake volume: few wallets cycling',
        'Check buy/sell ratio',
        'Social mentions should lag price',
      ],
    },
  ],
  strategies: [
    {
      title: 'The 3-3-3 Framework',
      tag: 'STRATEGY',
      content: `Allocate no more than 3% per play. Take profit at 3x. Never hold past 3x without a thesis update. Discipline over conviction in the trenches.`,
      risk: 'low',
    },
    {
      title: 'Early Migration Sniping',
      tag: 'ADVANCED',
      content: `Monitor pump.fun for tokens approaching 100% bonding curve completion. Position entry 10-15 minutes before graduation for Raydium liquidity event plays.`,
      risk: 'high',
    },
    {
      title: 'Deployer Copy Trading',
      tag: 'INTERMEDIATE',
      content: `Track verified deployers who have graduated 3+ projects. Mirror their new launches within first 60 seconds. Set tight stop-loss at -50%.`,
      risk: 'medium',
    },
  ],
}
