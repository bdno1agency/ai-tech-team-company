export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        panel: '#0b1220',
        surface: '#111827',
        accent: '#22c55e',
        danger: '#ef4444',
        warn: '#f59e0b',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(148, 163, 184, 0.2), 0 20px 35px rgba(15, 23, 42, 0.4)'
      }
    }
  },
  plugins: []
};
