module.exports = {
  content: [
    './renderer/app/**/*.{js,jsx,ts,tsx}',
    './renderer/features/**/*.{js,jsx,ts,tsx}',
    './node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('flowbite/plugin')],
};

