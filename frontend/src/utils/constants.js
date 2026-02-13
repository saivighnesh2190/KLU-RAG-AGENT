// App constants

export const APP_NAME = 'KLU Agent';
export const APP_DESCRIPTION = 'Your AI Campus Assistant';

// API endpoints (base paths)
export const API_ENDPOINTS = {
    CHAT: '/chat',
    DOCUMENTS: '/documents',
    ADMIN: '/admin',
    HEALTH: '/health',
};

// Chat suggestion chips
export const SUGGESTION_CHIPS = [
    {
        icon: '📚',
        text: 'What courses does CSE offer?',
    },
    {
        icon: '📅',
        text: 'Upcoming events this month',
    },
    {
        icon: '🎓',
        text: 'Admission requirements for B.Tech',
    },
    {
        icon: '👨‍🏫',
        text: 'Who is the HOD of CSE?',
    },
    {
        icon: '🏫',
        text: 'Library timings',
    },
    {
        icon: '📊',
        text: 'What is the placement record?',
    },
];

// Source type icons
export const SOURCE_TYPE_ICONS = {
    document: '📄',
    database: '🗃️',
};

// Animation variants for Framer Motion
export const ANIMATION_VARIANTS = {
    fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    },
    slideUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    },
    slideInLeft: {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
    },
    slideInRight: {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 },
    },
    scale: {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
    },
};

// Message roles
export const MESSAGE_ROLES = {
    USER: 'user',
    ASSISTANT: 'assistant',
};

// File upload config
export const FILE_UPLOAD = {
    ALLOWED_EXTENSIONS: ['.pdf', '.txt', '.md'],
    MAX_SIZE_MB: 10,
    MAX_SIZE_BYTES: 10 * 1024 * 1024,
};

// Local storage keys
export const STORAGE_KEYS = {
    CURRENT_SESSION: 'klu_agent_current_session',
    THEME: 'klu_agent_theme',
};
