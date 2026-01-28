/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        white: "#FFFFFF",
        "autumn-brown": "#9C672D",
        "woodland-brown": "#51371C",
        "forest-green": "#A0BD3D",
        "coral-blue": "#AAC9D4",
        primary: {
          DEFAULT: "#A0BD3D",
          dark: "#8CA834",
          light: "#B8CF6B",
        },
        secondary: {
          DEFAULT: "#51371C",
          dark: "#3E2A15",
          light: "#9C672D",
        },
        accent: {
          DEFAULT: "#AAC9D4",
          dark: "#8EBAC9",
          light: "#C5DADE",
        },
        background: {
          beige: "#F5F2E9",
          light: "#FFFFFF",
          dark: "#F0EBE0",
        },
        success: "#A0BD3D",
        error: "#D35F5F",
        warning: "#E9B949",
        info: "#AAC9D4",
        text: {
          primary: "#51371C",
          secondary: "#9C672D",
          light: "#FFFFFF",
        },
        border: {
          light: "#E5DFD3",
          medium: "#D5C9B6",
        },
        "scout-blue": "#003982", // Добавляем цвет, используемый в HelperPage
        "scout-blue-dark": "#002855", // Для hover состояния
        "scout-green": "#A0BD3D", // Совпадает с primary
        "scout-green-dark": "#8CA834", // Совпадает с primary-dark
      },
      fontFamily: {
        sans: ["Open Sans", "sans-serif"],
        heading: ["Montserrat", "sans-serif"],
        accent: ["Fredoka One", "cursive"],
      },
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.75rem",
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      spacing: {
        0: "0",
        1: "0.25rem",
        2: "0.5rem",
        3: "0.75rem",
        4: "1rem",
        5: "1.25rem",
        6: "1.5rem",
        8: "2rem",
        10: "2.5rem",
        12: "3rem",
        16: "4rem",
        20: "5rem",
        24: "6rem",
        32: "8rem",
      },
      borderRadius: {
        none: "0",
        sm: "0.25rem",
        DEFAULT: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        full: "9999px",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        DEFAULT: "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      },
      transitionDuration: {
        150: "150ms",
        200: "200ms",
        300: "300ms",
        500: "500ms",
        700: "700ms", // Добавляем duration-700
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1rem",
          md: "1.25rem",
          lg: "1.5rem",
          xl: "1.5rem",
        },
      },
      animation: {
        fadeIn: "fadeIn 700ms ease-out forwards",
        fadeInLeft: "fadeInLeft 700ms ease-out forwards",
        fadeInRight: "fadeInRight 700ms ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInLeft: {
          'from': { opacity: '0', transform: 'translateX(-20px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInRight: {
          'from': { opacity: '0', transform: 'translateX(20px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
  plugins: [],
};