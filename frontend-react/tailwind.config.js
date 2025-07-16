/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"]  
    ,
  theme: {
    extend: {
      keyframes: {
        moveRightLoop: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100vw)' } 
        },
      },
       animation: {
        moveRightLoop: 'moveRightLoop 5s linear infinite',
      },
    },
  },
  plugins: [],
}

