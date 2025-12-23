/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
            },
            colors: {
                brand: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    500: '#0ea5e9', // Sky 500
                    600: '#0284c7', // Sky 600
                    700: '#0369a1', // Sky 700
                    900: '#0c4a6e', // Sky 900
                },
                accent: {
                    500: '#10b981', // Emerald 500
                },
                slate: {
                    850: '#1e293b', // Custom dark
                    900: '#0f172a',
                }
            }
        }
    },
    plugins: [],
}
