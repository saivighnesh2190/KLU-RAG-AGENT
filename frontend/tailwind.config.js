/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Custom dark theme colors
                primary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                    950: '#082f49',
                },
                dark: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                    950: '#020617',
                },
            },
            animation: {
                'bounce-slow': 'bounce 1.5s infinite',
                'pulse-slow': 'pulse 3s infinite',
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-in-left': 'slideInLeft 0.3s ease-out',
                'slide-in-right': 'slideInRight 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideInLeft: {
                    '0%': { opacity: '0', transform: 'translateX(-10px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(10px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
            },
            typography: {
                DEFAULT: {
                    css: {
                        maxWidth: 'none',
                        color: '#e2e8f0',
                        a: {
                            color: '#38bdf8',
                            '&:hover': {
                                color: '#7dd3fc',
                            },
                        },
                        strong: {
                            color: '#f8fafc',
                        },
                        code: {
                            color: '#38bdf8',
                            backgroundColor: '#1e293b',
                            padding: '0.25rem 0.375rem',
                            borderRadius: '0.25rem',
                            fontWeight: '400',
                        },
                        'code::before': {
                            content: '""',
                        },
                        'code::after': {
                            content: '""',
                        },
                        pre: {
                            backgroundColor: '#0f172a',
                            color: '#e2e8f0',
                        },
                        h1: { color: '#f8fafc' },
                        h2: { color: '#f8fafc' },
                        h3: { color: '#f8fafc' },
                        h4: { color: '#f8fafc' },
                        blockquote: {
                            color: '#94a3b8',
                            borderLeftColor: '#38bdf8',
                        },
                        'ul > li::marker': {
                            color: '#38bdf8',
                        },
                        'ol > li::marker': {
                            color: '#38bdf8',
                        },
                        hr: {
                            borderColor: '#334155',
                        },
                        thead: {
                            borderBottomColor: '#334155',
                        },
                        'thead th': {
                            color: '#f8fafc',
                        },
                        'tbody tr': {
                            borderBottomColor: '#1e293b',
                        },
                        'tbody td': {
                            color: '#e2e8f0',
                        },
                    },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
