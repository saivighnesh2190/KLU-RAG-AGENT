import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { path: '/', label: 'Chat', icon: MessageSquare },
        { path: '/admin', label: 'Admin', icon: Settings },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <header className="glass border-b border-dark-700 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <img
                            src="/klu-logo.svg"
                            alt="KLU Agent"
                            className="h-10 w-10 group-hover:scale-105 transition-transform"
                        />
                        <div className="hidden sm:block">
                            <h1 className="text-xl font-bold gradient-text">KLU Agent</h1>
                            <p className="text-xs text-dark-400">AI Campus Assistant</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {navLinks.map(({ path, label, icon: Icon }) => (
                            <Link
                                key={path}
                                to={path}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive(path)
                                        ? 'bg-primary-500/20 text-primary-400'
                                        : 'text-dark-300 hover:text-white hover:bg-dark-700'
                                    }`}
                            >
                                <Icon size={18} />
                                <span className="font-medium">{label}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 rounded-lg text-dark-300 hover:text-white hover:bg-dark-700 transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <nav className="md:hidden py-4 border-t border-dark-700 animate-slide-up">
                        {navLinks.map(({ path, label, icon: Icon }) => (
                            <Link
                                key={path}
                                to={path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive(path)
                                        ? 'bg-primary-500/20 text-primary-400'
                                        : 'text-dark-300 hover:text-white hover:bg-dark-700'
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{label}</span>
                            </Link>
                        ))}
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Header;
