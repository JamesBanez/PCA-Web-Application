/** @type {import('tailwindcss').Config} */
export default {
    corePlugins: {
        preflight: false,
    },
    important: "#root",
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./src/pages/**/*.{html,js}",
        "./src/components/**/*.{html,js}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#efefef",
                secondary: "#a7b7d7",
                accent: "#0033A0",
                text: "#1e1e1e",
            },
            fontFamily: {
                inter: ["Inter", "sans-serif"],
            },
        },
    },
    plugins: [],
};
