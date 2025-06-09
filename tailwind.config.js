/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './widgets/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'bg-red-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-blue-500',
    'bg-gray-500',
    'hover:text-red-500',
    'hover:text-yellow-500',
    'hover:text-green-500',
    'hover:text-blue-500',
    'hover:text-gray-500'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}; 