import React from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './Header';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-dark-900">
            <Header />
            <main className="flex-1 flex flex-col">
                {children}
            </main>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#1e293b',
                        color: '#f8fafc',
                        border: '1px solid #334155',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#f8fafc',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#f8fafc',
                        },
                    },
                }}
            />
        </div>
    );
};

export default Layout;
