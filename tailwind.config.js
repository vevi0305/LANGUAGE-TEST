/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // Path to files using Tailwind
  theme: {
    extend: {
      screens: {
        others: "360px",
        miNote: "390px",
        oneSamPixelISE: "375px",
        iphoneXR: "414px",
      },
    }, // Customize themes if needed
  },
  plugins: [],
};
