import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

const Header = () => {
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { path: '/', label: 'Chat', icon: MessageSquare },
        { path: '/admin', label: 'Admin', icon: Settings },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <header className="glass-light border-b border-slate-200 sticky top-0 z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <motion.div
                            whileHover={{ rotate: [0, -10, 10, -5, 5, 0], scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <img
                                src="/klu-logo.svg"
                                alt="KLU Agent"
                                className="h-10 w-10 drop-shadow-sm"
                            />
                        </motion.div>
                        <div className="hidden sm:block">
                            <h1 className="text-xl font-bold gradient-text pb-0.5">KLU Agent</h1>
                            <p className="text-xs text-slate-500 font-medium">AI Campus Assistant</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-2">
                        {navLinks.map(({ path, label, icon: Icon }) => (
                            <Link
                                key={path}
                                to={path}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${isActive(path)
                                    ? 'bg-primary-50 text-primary-600 shadow-sm border border-primary-100'
                                    : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50 hover:shadow-sm'
                                    }`}
                            >
                                <Icon size={18} className={isActive(path) ? 'text-primary-500' : ''} />
                                <span className="font-medium">{label}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 rounded-lg text-slate-600 hover:text-primary-600 hover:bg-slate-100 transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <motion.nav
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="md:hidden py-4 border-t border-slate-200"
                    >
                        {navLinks.map(({ path, label, icon: Icon }) => (
                            <Link
                                key={path}
                                to={path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 mb-1 ${isActive(path)
                                    ? 'bg-primary-50 text-primary-600 border border-primary-100'
                                    : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <Icon size={20} className={isActive(path) ? 'text-primary-500' : ''} />
                                <span className="font-medium">{label}</span>
                            </Link>
                        ))}
                    </motion.nav>
                )}
            </div>
        </header>
    );
};

export default Header;
