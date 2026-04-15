export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        card: '0 25px 50px -12px rgba(15, 23, 42, 0.15)',
      },
      colors: {
        soul: {
          dark: '#231f40',
          purple: '#4c3ea3',
          gold: '#d3b86b',
          soft: '#f5f3ff',
        },
      },
    },
  },
  plugins: [],
}
