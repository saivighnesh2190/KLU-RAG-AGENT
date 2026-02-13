import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 60000, // 60 seconds for AI responses
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Add any auth tokens here if needed
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle common errors
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;

            switch (status) {
                case 400:
                    console.error('Bad request:', data);
                    break;
                case 401:
                    console.error('Unauthorized');
                    break;
                case 404:
                    console.error('Not found:', data);
                    break;
                case 500:
                    console.error('Server error:', data);
                    break;
                default:
                    console.error('API error:', data);
            }
        } else if (error.request) {
            // Request was made but no response received
            console.error('Network error - no response received');
        } else {
            // Error in setting up request
            console.error('Request error:', error.message);
        }

        return Promise.reject(error);
    }
);

// API methods
export const chatAPI = {
    sendMessage: (message, sessionId = null) => {
        return api.post('/chat', { message, session_id: sessionId });
    },

    getHistory: (sessionId) => {
        return api.get(`/chat/history/${sessionId}`);
    },

    clearHistory: (sessionId) => {
        return api.delete(`/chat/history/${sessionId}`);
    },

    getSessions: () => {
        return api.get('/chat/sessions');
    },
};

export const documentsAPI = {
    upload: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/documents/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    list: () => {
        return api.get('/documents');
    },

    delete: (docId) => {
        return api.delete(`/documents/${docId}`);
    },

    getStats: () => {
        return api.get('/documents/stats');
    },
};

export const adminAPI = {
    getDbStats: () => {
        return api.get('/admin/db-stats');
    },

    getSystemInfo: () => {
        return api.get('/admin/system-info');
    },

    seedDocuments: () => {
        return api.post('/admin/seed-documents');
    },
};

export const healthAPI = {
    check: () => {
        return api.get('/health');
    },

    ready: () => {
        return api.get('/health/ready');
    },
};

export default api;
