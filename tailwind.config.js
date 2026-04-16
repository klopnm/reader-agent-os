/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#0a0a0a',
        slate: {
          dark: '#1a1a1a',
          mid: '#242424',
          light: '#2e2e2e',
        },
        neon: {
          green: '#00ff41',
          dim: '#00cc34',
          glow: '#00ff4133',
          faint: '#00ff410d',
        },
        danger: '#ff3333',
        warn: '#ffaa00',
        info: '#00aaff',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 10px #00ff41, 0 0 20px #00ff4166',
        'neon-sm': '0 0 5px #00ff41, 0 0 10px #00ff4144',
        'neon-lg': '0 0 20px #00ff41, 0 0 40px #00ff4166, 0 0 80px #00ff4122',
        glass: 'inset 0 1px 0 0 rgba(255,255,255,0.04)',
      },
      animation: {
        'pulse-neon': 'pulseNeon 2s ease-in-out infinite',
        'scan-line': 'scanLine 4s linear infinite',
        'blink': 'blink 1s step-end infinite',
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        pulseNeon: {
          '0%, 100%': { textShadow: '0 0 4px #00ff41, 0 0 10px #00ff41' },
          '50%': { textShadow: '0 0 8px #00ff41, 0 0 20px #00ff41, 0 0 30px #00ff41' },
        },
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 5px #00ff41, 0 0 10px #00ff4144' },
          '50%': { boxShadow: '0 0 15px #00ff41, 0 0 30px #00ff4166, 0 0 50px #00ff4122' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
