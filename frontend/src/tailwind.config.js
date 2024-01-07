const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    content: ['./src/**/*.{js,jsx,ts,tsx}', './src/components/**/*.{js,jsx,ts,tsx}', './components/pages/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {},
    },
    plugins: [],
});

