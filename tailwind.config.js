/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
   content: [
    './app/**/*.{vue,js,ts}',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './plugins/**/*.{js,ts}',
    "./app.vue",
    "./error.vue",
    "presets/**/*.{js,vue,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Verdana','Geneva','Tahoma','sans-serif'],
        verdana: ['Verdana','Geneva','Tahoma','sans-serif'],
  
        // 'manrope-b': ['Manrope-Bold'],
        // 'manrope-extrab': ['Manrope-ExtraBold'],
        // 'manrope-extral': ['Manrope-ExtraLight'],
        // 'manrope-l': ['Manrope-Light'],
        // 'manrope-r': ['Manrope-Regular'],
        // 'verdana-r': ['Verdana-Regular'],
        // 'verdana-b': ['Verdana-Bold'],
        // 'verdana-i': ['Verdana-Italic'],
        // 'verdana-b-i': ['Verdana-Bold-Italic'],
        // 'futura-m': ['Futura-Medium'],
        // 'futura-l': ['Futura-Light'],
        // 'futura-l-o': ['Futura-Light-Oblique'],
        // 'futura-b': ['Futura-Bold'],
        // 'futura-b-o': ['Futura-Bold-Oblique'],
      },
    },
  },
  plugins: [],
}

