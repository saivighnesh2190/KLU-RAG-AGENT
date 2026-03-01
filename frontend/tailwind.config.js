/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    safelist: [
        // RAG theme gradients
        'from-indigo-50', 'via-purple-50/80', 'to-blue-50',
        'from-cyan-50', 'via-teal-50/80', 'to-emerald-50',
        'from-amber-50', 'via-orange-50/80', 'to-yellow-50',
        'from-blue-50', 'via-sky-50/80', 'to-slate-50',
        'from-emerald-50', 'via-green-50/80', 'to-lime-50',
        'from-violet-50', 'via-fuchsia-50/80', 'to-pink-50',
        'from-indigo-500', 'to-purple-600',
        'from-cyan-500', 'to-teal-600',
        'from-amber-500', 'to-orange-600',
        'from-blue-500', 'to-sky-600',
        'from-emerald-500', 'to-green-600',
        'from-violet-500', 'to-fuchsia-600',
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
                'bounce-slow': 'bounce 2s infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'slide-in-left': 'slideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'slide-in-right': 'slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'float': 'float 6s ease-in-out infinite',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
                'spin-slow': 'spin 8s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideInLeft: {
                    '0%': { opacity: '0', transform: 'translateX(-20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                pulseGlow: {
                    '0%, 100%': { opacity: '1', boxShadow: '0 0 15px rgba(56, 189, 248, 0.3)' },
                    '50%': { opacity: '.6', boxShadow: '0 0 25px rgba(56, 189, 248, 0.6)' },
                }
            },
            typography: {
                DEFAULT: {
                    css: {
                        maxWidth: 'none',
                        color: '#1e293b', /* slate-800 */
                        a: {
                            color: '#0284c7', /* primary-600 */
                            '&:hover': {
                                color: '#0369a1', /* primary-700 */
                            },
                        },
                        strong: {
                            color: '#0f172a', /* slate-900 */
                        },
                        h1: { color: '#0f172a' },
                        h2: { color: '#0f172a' },
                        h3: { color: '#0f172a' },
                        h4: { color: '#0f172a' },
                        blockquote: {
                            color: '#475569', /* slate-600 */
                            borderLeftColor: '#38bdf8', /* primary-400 */
                        },
                        'ul > li::marker': {
                            color: '#0284c7', /* primary-600 */
                        },
                        'ol > li::marker': {
                            color: '#0284c7', /* primary-600 */
                        },
                        hr: {
                            borderColor: '#cbd5e1', /* slate-300 */
                        }
                    },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
