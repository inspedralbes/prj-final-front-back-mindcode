/** @type {import('tailwindcss').Config} */
export default {
  important: true,
  content: [
    "./src/app/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/Login/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/JoinClass/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  darkMode: 'class',  
  plugins: [],
};
