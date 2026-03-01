import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
    return (
        <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
                <h1 className="text-8xl font-bold gradient-text mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-slate-800 mb-2">Page Not Found</h2>
                <p className="text-slate-500 mb-8 max-w-md">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <div className="flex items-center justify-center space-x-4">
                    <Link
                        to="/"
                        className="btn-primary inline-flex items-center space-x-2"
                    >
                        <Home size={18} />
                        <span>Go Home</span>
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
                    >
                        <ArrowLeft size={18} />
                        <span>Go Back</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
