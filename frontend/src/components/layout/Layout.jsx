import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Network, Database, Settings, Layout as LayoutIcon, MessageSquare, Activity } from 'lucide-react';

function NavIcon({ icon: Icon, active, onClick, title }) {
    return (
        <button
            onClick={onClick}
            title={title}
            className={`p-3 rounded-xl transition-all duration-200 ${
                active
                    ? 'bg-indigo-100 text-indigo-700 shadow-[inset_0_0_12px_rgba(79,70,229,0.1)]'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
        >
            <Icon className="w-5 h-5" />
        </button>
    );
}

const Layout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const getActiveTab = () => {
        if (location.pathname === '/') return 'chat';
        if (location.pathname === '/admin') return 'data';
        return '';
    };

    const activeTab = getActiveTab();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col selection:bg-indigo-200">
            <header className="h-14 border-b border-slate-200 bg-white/90 flex items-center justify-between px-4 backdrop-blur-md z-30">
                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
                        <Network className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-slate-800 tracking-wide">Nexus<span className="text-indigo-600">RAG</span></span>
                    <div className="h-4 w-px bg-slate-300 mx-2"></div>
                    <span className="text-xs font-medium px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200 flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                        System Online
                    </span>
                </div>

                <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-slate-100 border border-slate-200">
                        <Database className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-600">Index: <span className="text-slate-900 font-medium">corp-knowledge-v4</span></span>
                    </div>
                    <button className="p-2 hover:bg-slate-100 rounded-full transition-colors" onClick={() => navigate('/admin')}>
                        <Settings className="w-5 h-5 text-slate-500" />
                    </button>
                </div>
            </header>

            <div className="flex-1 flex flex-row overflow-hidden relative">
                <aside className="w-16 flex flex-col items-center py-6 border-r border-slate-200 bg-white space-y-6 z-20">
                    <NavIcon icon={LayoutIcon} active={activeTab === 'dashboard'} onClick={() => navigate('/')} title="Dashboard" />
                    <NavIcon icon={MessageSquare} active={activeTab === 'chat'} onClick={() => navigate('/')} title="Chat" />
                    <NavIcon icon={Database} active={activeTab === 'data'} onClick={() => navigate('/admin')} title="Data Management" />
                    <NavIcon icon={Activity} active={activeTab === 'metrics'} onClick={() => navigate('/admin')} title="System Metrics" />
                </aside>

                <main className="flex-1 flex flex-col w-full h-full relative z-10 overflow-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;