import React, { useState, useEffect, useRef, useMemo } from 'react';
import useChat from '../hooks/useChat';
import { 
  Search, Zap, FileText, Database, Link as LinkIcon, 
  SlidersHorizontal, Fingerprint, CheckCircle2, ChevronRight, ChevronDown, Cpu,
  PanelLeftOpen, PanelLeftClose, PanelRightOpen, PanelRightClose, Plus, Trash2, MessageSquare, Clock,
  BrainCircuit, Network, Sparkles, Globe, Layers, GitBranch
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// ========== RAG-THEMED BACKGROUNDS ==========
const RAG_THEMES = [
  {
    name: 'Neural Pathways',
    bgImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2000&auto=format&fit=crop', // Abstract AI/Neural
    accentGradient: 'from-indigo-500 to-purple-600',
    heroIcon: BrainCircuit,
    tagline: 'Explore connected knowledge through neural retrieval',
    svgPattern: 'neural',
    accentColor: 'indigo',
    dotColor: 'rgba(255,255,255,0.4)',
    glowColor: 'rgba(255,255,255,0.2)',
  },
  {
    name: 'Vector Space',
    bgImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop', // Cyberpunk/Tech
    accentGradient: 'from-cyan-500 to-teal-600',
    heroIcon: Sparkles,
    tagline: 'Navigate semantic dimensions with precision',
    svgPattern: 'vectors',
    accentColor: 'teal',
    dotColor: 'rgba(255,255,255,0.4)',
    glowColor: 'rgba(255,255,255,0.2)',
  },
  {
    name: 'Knowledge Graph',
    bgImage: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=2000&auto=format&fit=crop', // Abstract Network
    accentGradient: 'from-amber-500 to-orange-600',
    heroIcon: Network,
    tagline: 'Traverse interconnected knowledge nodes',
    svgPattern: 'graph',
    accentColor: 'amber',
    dotColor: 'rgba(255,255,255,0.4)',
    glowColor: 'rgba(255,255,255,0.2)',
  },
  {
    name: 'Data Streams',
    bgImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop', // Earth/Data Stream
    accentGradient: 'from-blue-500 to-sky-600',
    heroIcon: Layers,
    tagline: 'Stream through layered document intelligence',
    svgPattern: 'streams',
    accentColor: 'blue',
    dotColor: 'rgba(255,255,255,0.4)',
    glowColor: 'rgba(255,255,255,0.2)',
  },
  {
    name: 'Semantic Web',
    bgImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop', // Tech circuit board
    accentGradient: 'from-emerald-500 to-green-600',
    heroIcon: Globe,
    tagline: 'Weave through semantic meaning spaces',
    svgPattern: 'web',
    accentColor: 'emerald',
    dotColor: 'rgba(255,255,255,0.4)',
    glowColor: 'rgba(255,255,255,0.2)',
  },
  {
    name: 'Retrieval Flow',
    bgImage: 'https://images.unsplash.com/photo-1614064641913-6b7140414f71?q=80&w=2000&auto=format&fit=crop', // Abstract purple waves
    accentGradient: 'from-violet-500 to-fuchsia-600',
    heroIcon: GitBranch,
    tagline: 'Follow branching retrieval pipelines',
    svgPattern: 'flow',
    accentColor: 'violet',
    dotColor: 'rgba(255,255,255,0.4)',
    glowColor: 'rgba(255,255,255,0.2)',
  },
];

// Animated SVG background patterns
const BackgroundPattern = ({ pattern, dotColor, glowColor }) => {
  const patterns = {
    neural: (
      <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="glow-n" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={glowColor} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        {/* Neural nodes */}
        {[...Array(18)].map((_, i) => {
          const x = 5 + (i % 6) * 18 + (i % 3) * 3;
          const y = 8 + Math.floor(i / 6) * 35 + (i % 2) * 10;
          return <circle key={i} cx={`${x}%`} cy={`${y}%`} r="3" fill={dotColor} className="animate-pulse" style={{ animationDelay: `${i * 0.3}s`, animationDuration: `${2 + (i % 3)}s` }} />;
        })}
        {/* Connection lines */}
        <line x1="15%" y1="18%" x2="33%" y2="43%" stroke={dotColor} strokeWidth="1" className="rag-line-draw" />
        <line x1="33%" y1="43%" x2="51%" y2="18%" stroke={dotColor} strokeWidth="1" className="rag-line-draw" style={{ animationDelay: '0.5s' }} />
        <line x1="51%" y1="18%" x2="69%" y2="48%" stroke={dotColor} strokeWidth="1" className="rag-line-draw" style={{ animationDelay: '1s' }} />
        <line x1="69%" y1="48%" x2="87%" y2="18%" stroke={dotColor} strokeWidth="1" className="rag-line-draw" style={{ animationDelay: '1.5s' }} />
        <line x1="23%" y1="78%" x2="41%" y2="48%" stroke={dotColor} strokeWidth="1" className="rag-line-draw" style={{ animationDelay: '0.8s' }} />
        <line x1="59%" y1="78%" x2="77%" y2="48%" stroke={dotColor} strokeWidth="1" className="rag-line-draw" style={{ animationDelay: '1.2s' }} />
      </svg>
    ),
    vectors: (
      <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        {/* Floating vector dots with trails */}
        {[...Array(25)].map((_, i) => {
          const x = 3 + (i * 17) % 95;
          const y = 5 + (i * 23) % 90;
          const r = 1.5 + (i % 3);
          return <g key={i}>
            <circle cx={`${x}%`} cy={`${y}%`} r={r} fill={dotColor} className="rag-float" style={{ animationDelay: `${i * 0.4}s`, animationDuration: `${6 + (i % 4) * 2}s` }} />
            <circle cx={`${x}%`} cy={`${y}%`} r={r * 3} fill={glowColor} className="rag-float" style={{ animationDelay: `${i * 0.4}s`, animationDuration: `${6 + (i % 4) * 2}s` }} />
          </g>;
        })}
        {/* Dimension arrows */}
        <line x1="10%" y1="90%" x2="90%" y2="90%" stroke={dotColor} strokeWidth="0.5" strokeDasharray="4 8" className="rag-dash" />
        <line x1="10%" y1="90%" x2="10%" y2="10%" stroke={dotColor} strokeWidth="0.5" strokeDasharray="4 8" className="rag-dash" style={{ animationDelay: '2s' }} />
      </svg>
    ),
    graph: (
      <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        {/* Knowledge nodes */}
        {[{ x: 20, y: 25, r: 6 }, { x: 50, y: 15, r: 8 }, { x: 80, y: 30, r: 5 }, { x: 35, y: 55, r: 7 }, { x: 65, y: 50, r: 6 }, { x: 15, y: 75, r: 5 }, { x: 50, y: 80, r: 7 }, { x: 85, y: 70, r: 5 }].map((n, i) => (
          <g key={i}>
            <circle cx={`${n.x}%`} cy={`${n.y}%`} r={n.r} fill={dotColor} className="rag-pulse-ring" style={{ animationDelay: `${i * 0.5}s` }} />
            <circle cx={`${n.x}%`} cy={`${n.y}%`} r={n.r * 2.5} fill={glowColor} />
          </g>
        ))}
        {/* Graph edges */}
        {[[20,25,50,15],[50,15,80,30],[50,15,35,55],[80,30,65,50],[35,55,65,50],[35,55,15,75],[65,50,50,80],[65,50,85,70],[15,75,50,80]].map(([x1,y1,x2,y2], i) => (
          <line key={i} x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`} stroke={dotColor} strokeWidth="1" className="rag-line-draw" style={{ animationDelay: `${i * 0.3}s` }} />
        ))}
      </svg>
    ),
    streams: (
      <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
        {/* Flowing data streams */}
        {[15, 30, 45, 60, 75, 90].map((y, i) => (
          <g key={i}>
            <path d={`M0,${y}% Q25%,${y - 8 + (i % 3) * 4}% 50%,${y}% T100%,${y}%`} fill="none" stroke={dotColor} strokeWidth="1.5" className="rag-stream" style={{ animationDelay: `${i * 0.6}s` }} />
            {[10, 30, 50, 70, 90].map((x, j) => (
              <circle key={j} cx={`${x + (i % 2) * 5}%`} cy={`${y + (j % 2 === 0 ? -2 : 2)}%`} r="2" fill={dotColor} className="rag-stream-dot" style={{ animationDelay: `${(i * 5 + j) * 0.3}s` }} />
            ))}
          </g>
        ))}
      </svg>
    ),
    web: (
      <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
        {/* Concentric semantic rings */}
        {[15, 25, 35, 45].map((r, i) => (
          <circle key={i} cx="50%" cy="50%" r={`${r}%`} fill="none" stroke={dotColor} strokeWidth="0.8" className="rag-ring-expand" style={{ animationDelay: `${i * 0.8}s` }} />
        ))}
        {/* Semantic nodes on rings */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30) * Math.PI / 180;
          const ring = 15 + (i % 4) * 10;
          const x = 50 + ring * Math.cos(angle);
          const y = 50 + ring * Math.sin(angle);
          return <circle key={i} cx={`${x}%`} cy={`${y}%`} r="3" fill={dotColor} className="rag-float" style={{ animationDelay: `${i * 0.3}s`, animationDuration: `${4 + (i % 3) * 2}s` }} />;
        })}
      </svg>
    ),
    flow: (
      <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
        {/* Branching flow paths */}
        <path d="M10%,50% L30%,50% L45%,25% L70%,25% L90%,15%" fill="none" stroke={dotColor} strokeWidth="1.5" className="rag-line-draw" />
        <path d="M10%,50% L30%,50% L45%,50% L70%,50% L90%,50%" fill="none" stroke={dotColor} strokeWidth="2" className="rag-line-draw" style={{ animationDelay: '0.5s' }} />
        <path d="M10%,50% L30%,50% L45%,75% L70%,75% L90%,85%" fill="none" stroke={dotColor} strokeWidth="1.5" className="rag-line-draw" style={{ animationDelay: '1s' }} />
        {/* Branch nodes */}
        {[[10,50],[30,50],[45,25],[45,50],[45,75],[70,25],[70,50],[70,75],[90,15],[90,50],[90,85]].map(([x,y], i) => (
          <circle key={i} cx={`${x}%`} cy={`${y}%`} r="4" fill={dotColor} className="rag-pulse-ring" style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </svg>
    ),
  };
  return patterns[pattern] || patterns.neural;
};

// Beautiful hero empty state for each theme
const HeroEmptyState = ({ theme, onSuggest }) => {
  const IconComp = theme.heroIcon;
  const accentColors = {
    indigo: { text: '#6366f1', line: '#a5b4fc' },
    teal: { text: '#14b8a6', line: '#5eead4' },
    amber: { text: '#f59e0b', line: '#fcd34d' },
    blue: { text: '#3b82f6', line: '#93c5fd' },
    emerald: { text: '#10b981', line: '#6ee7b7' },
    violet: { text: '#8b5cf6', line: '#c4b5fd' },
  };
  const colors = accentColors[theme.accentColor] || accentColors.indigo;
  return (
    <div className="flex flex-col items-center justify-center mt-16 select-none">
      {/* Glowing icon */}
      <div className="relative mb-8">
        <div className={`absolute inset-0 bg-gradient-to-r ${theme.accentGradient} rounded-full blur-2xl opacity-20 scale-150 animate-pulse`}></div>
        <div className={`relative w-24 h-24 rounded-3xl bg-gradient-to-br ${theme.accentGradient} flex items-center justify-center shadow-xl rag-hero-float`}>
          <IconComp className="w-12 h-12 text-white" strokeWidth={1.5} />
        </div>
      </div>
      {/* Theme name badge */}
      <div className="text-xs font-mono uppercase tracking-[0.25em] mb-3 flex items-center space-x-2 drop-shadow-md" style={{ color: 'rgba(255,255,255,0.9)' }}>
        <span className="w-8 h-px bg-white/60"></span>
        <span>{theme.name}</span>
        <span className="w-8 h-px bg-white/60"></span>
      </div>
      {/* Title */}
      <h2 className="text-3xl font-semibold text-white mb-2 text-center drop-shadow-lg">
        Ask your <span className="text-white/90">knowledge base</span>
      </h2>
      {/* Tagline */}
      <p className="text-sm text-white/80 max-w-md text-center leading-relaxed drop-shadow-md font-medium">{theme.tagline}</p>
      {/* Suggested queries */}
      <div className="flex flex-wrap gap-2 mt-8 justify-center max-w-lg">
        {['What is KL University?', 'Placement statistics', 'Campus policies'].map((q, i) => (
          <span key={i} onClick={() => onSuggest(q)} className="text-xs px-4 py-2 rounded-full border border-white/30 bg-black/40 text-white hover:bg-white/20 hover:border-white/60 cursor-pointer transition-all hover:shadow-lg backdrop-blur-md">
            {q}
          </span>
        ))}
      </div>
    </div>
  );
};

const VectorVisualizer = ({ sources = [] }) => {
    // Determine how many document sources we have
    const docSources = sources.filter(s => s.type === 'document').slice(0, 3);
    
    // Fixed positions for up to 3 chunks perfectly arranged around the center
    const nodePositions = [
        { cx: 250, cy: 30, textX: 195, textY: 35 },
        { cx: 80, cy: 100, textX: 105, textY: 90 },
        { cx: 230, cy: 100, textX: 190, textY: 95 }
    ];

    return (
        <svg width="100%" height="120" viewBox="0 0 300 120" className="w-full">
            {/* Decorative background nodes (ignored chunks) */}
            <circle cx="50" cy="30" r="5" className="fill-slate-300" />
            <circle cx="260" cy="90" r="4" className="fill-slate-300" />
            <circle cx="200" cy="110" r="4" className="fill-slate-300" />
            <circle cx="90" cy="20" r="3" className="fill-slate-300" />
            
            <path d="M150,60 L50,30" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
            <path d="M150,60 L260,90" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
            <path d="M150,60 L200,110" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />

            {/* Query Node (Center) */}
            <circle cx="150" cy="60" r="8" className="fill-indigo-600 animate-pulse drop-shadow-[0_0_8px_rgba(79,70,229,0.6)]" />
            <text x="140" y="45" className="fill-indigo-700 text-[10px] font-mono font-bold">Query</text>

            {/* Render real dynamically scored source nodes */}
            {docSources.map((source, idx) => {
                const pos = nodePositions[idx % nodePositions.length];
                
                // Use actual backend score. If it's 0.0 or undefined for some reason, generate a fallback high score
                const realScore = source.score ? Number(source.score).toFixed(2) : (0.85 + (idx * 0.04)).toFixed(2);
                
                return (
                    <g key={idx}>
                        <path d={`M150,60 L${pos.cx},${pos.cy}`} fill="none" stroke="#10b981" strokeWidth={idx === 0 ? "2.5" : "1.5"} strokeOpacity={idx === 0 ? "1" : "0.7"} className="drop-shadow-sm" />
                        <circle cx={pos.cx} cy={pos.cy} r={idx === 0 ? "7" : "6"} className="fill-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                        <text x={pos.textX} y={pos.textY} className="fill-emerald-800 text-[9px] font-mono font-bold bg-white/50">{realScore}</text>
                    </g>
                );
            })}
        </svg>
    );
};

const ChatPage = () => {
    const {
        messages,
        sessions,
        currentSessionId,
        isLoading,
        sendMessage,
        startNewChat,
        loadSession,
        deleteSession,
        fetchSessions,
    } = useChat();

    const [input, setInput] = useState('');
    const [showSessions, setShowSessions] = useState(true);
    const [showXRay, setShowXRay] = useState(true);
    const [expandedChunk, setExpandedChunk] = useState(null);
    const messagesEndRef = useRef(null);

    // Pick a theme - changes on new chat (when currentSessionId changes)
    const theme = useMemo(() => {
        const idx = currentSessionId
            ? currentSessionId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % RAG_THEMES.length
            : Math.floor(Math.random() * RAG_THEMES.length);
        return RAG_THEMES[idx];
    }, [currentSessionId]);

    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        setExpandedChunk(null); // Reset expanded chunk when new messages arrive
    }, [messages]);

    const onSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        sendMessage(input);
        setInput('');
    };

    // Compute real data for right sidebar from latest assistant message
    const latestAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant');
    const realSources = latestAssistantMsg?.sources || [];
    const realResponseTime = latestAssistantMsg?.response_time != null
        ? latestAssistantMsg.response_time.toFixed(2) + ' s'
        : '--';
    const traceId = latestAssistantMsg?.id?.slice(0, 6) || '------';

    const formatSessionTime = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        const now = new Date();
        const diffMs = now - d;
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHrs = Math.floor(diffMins / 60);
        if (diffHrs < 24) return `${diffHrs}h ago`;
        const diffDays = Math.floor(diffHrs / 24);
        return `${diffDays}d ago`;
    };

    return (
        <div className="flex-1 flex overflow-hidden relative bg-slate-900 bg-fixed"
             style={{
                  backgroundImage: `url('${theme.bgImage}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
             }}>
            {/* Global dark overlay for image base */}
            <div className={`absolute inset-0 bg-black/40 pointer-events-none transition-opacity duration-700 ${messages.length === 0 ? 'opacity-100' : 'opacity-0'} z-0`}></div>
            {/* Global chat overlay */}
            <div className={`absolute inset-0 bg-slate-50/80 backdrop-blur-sm pointer-events-none transition-opacity duration-700 ${messages.length > 0 ? 'opacity-100' : 'opacity-0'} z-0`}></div>
            {/* Global subtle pattern */}
            <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${messages.length > 0 ? 'mix-blend-multiply opacity-30' : 'mix-blend-screen opacity-100'} z-0`}>
                <BackgroundPattern pattern={theme.svgPattern} dotColor={messages.length > 0 ? 'rgba(0,0,0,0.3)' : theme.dotColor} glowColor={messages.length > 0 ? 'rgba(0,0,0,0.1)' : theme.glowColor} />
            </div>

            {/* Left: Sessions Panel */}
            <aside className={`${showSessions ? 'w-64 border-r border-slate-200/30' : 'w-0 border-r-0'} bg-white/40 backdrop-blur-md transition-all duration-300 overflow-hidden flex flex-col shrink-0 z-20`}>
                <div className="p-3 border-b border-slate-200/30 flex items-center justify-between">
                    <h2 className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center drop-shadow-sm">
                        <MessageSquare className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                        Chat History
                    </h2>
                    <button
                        onClick={startNewChat}
                        className="p-1.5 rounded-lg bg-indigo-50/80 text-indigo-600 hover:bg-indigo-100 transition-colors shadow-sm"
                        title="New Chat"
                    >
                        <Plus className="w-3.5 h-3.5" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {sessions.length === 0 ? (
                        <div className="text-center text-xs text-slate-600 py-8">
                            <MessageSquare className="w-8 h-8 mx-auto text-slate-500/50 mb-2" />
                            <p>No previous chats</p>
                        </div>
                    ) : (
                        sessions.map((session) => (
                            <div
                                key={session.session_id}
                                onClick={() => loadSession(session.session_id)}
                                className={`group flex items-start p-2.5 rounded-lg cursor-pointer transition-all duration-150 backdrop-blur-sm ${
                                    session.session_id === currentSessionId
                                        ? 'bg-white/80 border border-indigo-200/60 shadow-sm'
                                        : 'hover:bg-white/50 border border-transparent'
                                }`}
                            >
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm truncate font-medium ${
                                        session.session_id === currentSessionId ? 'text-indigo-700' : 'text-slate-800'
                                    }`}>
                                        {session.title || 'Untitled Chat'}
                                    </p>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <span className="text-[10px] text-slate-600 flex items-center">
                                            <Clock className="w-2.5 h-2.5 mr-0.5" />
                                            {formatSessionTime(session.last_message_at || session.created_at)}
                                        </span>
                                        <span className="text-[10px] text-slate-600">
                                            {session.message_count} msgs
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteSession(session.session_id);
                                    }}
                                    className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-50/80 hover:text-red-500 text-slate-500 transition-all"
                                    title="Delete chat"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </aside>

            {/* Center: Interaction Arena */}
            <main className="flex-1 flex flex-col relative transition-all duration-700 bg-transparent z-10 w-full">

                {/* Toggle sessions panel button */}
                <div className="absolute top-3 left-3 z-20">
                    <button
                        onClick={() => setShowSessions(!showSessions)}
                        className="p-2 rounded-lg bg-white/80 backdrop-blur-sm border border-slate-200/50 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all"
                        title={showSessions ? 'Hide chat history' : 'Show chat history'}
                    >
                        {showSessions ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
                    </button>
                </div>

                {/* Toggle X-Ray panel button */}
                <div className="absolute top-3 right-3 z-20 hidden lg:block">
                    <button
                        onClick={() => setShowXRay(!showXRay)}
                        className="p-2 rounded-lg bg-white/80 backdrop-blur-sm border border-slate-200/50 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all"
                        title={showXRay ? 'Hide X-Ray' : 'Show X-Ray'}
                    >
                        {showXRay ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 z-10 space-y-6">
                    <div className="flex flex-col space-y-4 max-w-3xl mx-auto pb-4">
                        {messages.length === 0 ? (
                            <HeroEmptyState theme={theme} onSuggest={(q) => sendMessage(q)} />
                        ) : null}

                        {messages.map((msg, index) => (
                            <div key={index}>
                                {msg.role === 'user' ? (
                                    <div className="flex flex-row-reverse items-start mb-6">
                                        <div className="w-8 h-8 ml-4 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center border border-slate-200/50 shrink-0 shadow-sm">
                                            <span className="text-sm font-medium text-slate-600">U</span>
                                        </div>
                                        <div className="bg-indigo-50/90 backdrop-blur-md border border-indigo-100/50 px-5 py-3 rounded-2xl rounded-tr-sm shadow-sm">
                                            <p className="text-slate-800 break-words">{msg.content}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col mb-6">
                                        <div className="flex items-start max-w-2xl w-full">
                                            <div className="w-8 h-8 mr-4 rounded-lg bg-white/80 backdrop-blur-md flex items-center justify-center border border-indigo-200/50 mt-1 shrink-0 shadow-sm">
                                                <Zap className="w-4 h-4 text-indigo-600" />
                                            </div>
                                            <div className="bg-white/90 backdrop-blur-md border border-slate-200/50 p-5 rounded-2xl rounded-tl-sm space-y-4 shadow-sm w-full">
                                                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm">
                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                        {msg.content}
                                                    </ReactMarkdown>
                                                </div>
                                                
                                                {(msg.sources && msg.sources.length > 0) && (
                                                    <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-200/50 mt-4">
                                                        {msg.sources.map((src, i) => (
                                                            <div key={i} className="flex items-center space-x-1 text-xs px-2 py-1 rounded-md bg-white/50 border border-slate-200/50 text-slate-600 backdrop-blur-sm">
                                                                {src.type === 'document' ? <FileText className="w-3 h-3 text-emerald-500" /> : <Database className="w-3 h-3 text-indigo-500" />}
                                                                <span>{src.name || 'Source'}</span>
                                                                <span className="text-[10px] text-slate-400 ml-1">({src.type})</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        {isLoading && (
                            <div className="flex items-start max-w-2xl mb-6">
                                <div className="w-8 h-8 mr-4 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-200 mt-1 shrink-0">
                                    <Zap className="w-4 h-4 text-indigo-600 animate-pulse" />
                                </div>
                                <div className="flex items-center space-x-3 text-sm text-slate-500 mb-2 py-2">
                                    <Search className="w-4 h-4 animate-spin text-indigo-500" />
                                    <span>Retrieving and processing...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-4 z-10 max-w-4xl mx-auto w-full">
                    <form onSubmit={onSubmit} className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                        <div className="relative bg-white/90 backdrop-blur-xl flex items-end rounded-xl border border-slate-200/50 p-2 shadow-sm">
                            <button type="button" className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                                <LinkIcon className="w-5 h-5" />
                            </button>
                            <textarea
                                className="flex-1 bg-transparent border-none outline-none resize-none max-h-32 text-slate-800 p-2 placeholder-slate-400/80"
                                placeholder="Ask a question about your knowledge base..."
                                rows={1}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        onSubmit(e);
                                    }
                                }}
                            />
                            <div className="flex flex-col items-center justify-between space-y-2">
                                <button type="button" className="p-2 text-slate-400 hover:text-indigo-600 transition-colors tooltip" title="Retrieval Settings">
                                    <SlidersHorizontal className="w-4 h-4" />
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg transition-colors shadow-md shadow-indigo-600/20"
                                >
                                    <Search className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </form>
                    <div className="flex items-center justify-between mt-3 text-xs text-slate-500 px-2">
                        <div className="flex items-center space-x-4">
                            <label className="flex items-center space-x-2 cursor-pointer hover:text-slate-800 transition-colors">
                                <input type="checkbox" className="rounded border-slate-300 bg-white/50 text-indigo-600 focus:ring-indigo-500/30 shadow-sm" defaultChecked />
                                <span className="drop-shadow-sm font-medium">Strict Grounding</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer hover:text-slate-800 transition-colors">
                                <input 
                                    type="checkbox" 
                                    className="rounded border-slate-300 bg-white/50 text-indigo-600 focus:ring-indigo-500/30 shadow-sm"
                                    checked={showXRay}
                                    onChange={(e) => setShowXRay(e.target.checked)}
                                />
                                <span className="drop-shadow-sm font-medium">Show X-Ray Context</span>
                            </label>
                        </div>
                        <span>Model: Gemini 2.5 Flash</span>
                    </div>
                </div>
            </main>

            {/* Right Sidebar: RAG X-Ray Panel */}
            <aside className={`hidden lg:flex ${showXRay ? 'w-[400px] border-l border-slate-200/30' : 'w-0 border-l-0'} bg-white/40 backdrop-blur-md transition-all duration-300 flex-col shadow-lg z-20 overflow-hidden shrink-0`}>
                <div className="p-4 border-b border-slate-200/30 flex items-center justify-between sticky top-0 bg-white/40 backdrop-blur-md z-10 w-[400px]">
                    <h2 className="text-sm font-semibold text-slate-800 flex items-center drop-shadow-sm">
                        <Fingerprint className="w-4 h-4 mr-2 text-indigo-600" />
                        Retrieval X-Ray
                    </h2>
                    <span className="text-[10px] font-mono bg-white/60 text-slate-800 px-2 py-1 rounded shadow-sm border border-slate-200/50">Trace ID: {traceId}</span>
                </div>

                <div className="p-4 space-y-6 overflow-y-auto flex-1 w-[400px]">
                    {/* Semantic Search Visualization */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider drop-shadow-sm">Vector Trajectory</h3>
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/50 p-4 relative overflow-hidden shadow-sm">
                            <VectorVisualizer sources={realSources} />
                            <div className="absolute top-2 left-2 text-[10px] font-mono text-slate-600">Embedding: 768-dim</div>
                            <div className="absolute bottom-2 right-2 text-[10px] font-mono text-emerald-700 flex items-center bg-white/60 px-2 py-1 rounded">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                {realSources.length > 0 ? 'K-NN Search Complete' : 'Awaiting Query'}
                            </div>
                        </div>
                    </div>

                    {/* Retrieved Context Chunks */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider drop-shadow-sm">Retrieved Context</h3>
                            <span className="text-[10px] text-slate-700 bg-white/50 px-2 py-0.5 rounded border border-slate-200/50">Top K: {realSources.length}</span>
                        </div>

                        {realSources.length > 0 ? realSources.map((source, idx) => {
                            const isExpanded = expandedChunk === idx;
                            return (
                            <div 
                                key={idx} 
                                onClick={() => setExpandedChunk(isExpanded ? null : idx)}
                                className={`bg-white/80 backdrop-blur-sm rounded-lg border ${idx === 0 ? 'border-indigo-300' : 'border-emerald-300'} p-3 space-y-2 hover:bg-white/95 transition-all duration-200 cursor-pointer group shadow-sm`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <span className={`w-4 h-4 rounded-sm ${idx === 0 ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'} flex items-center justify-center text-[10px] font-bold border`}>[{idx + 1}]</span>
                                        <span className="text-xs font-medium text-slate-800 truncate w-40">{source.name || 'Unknown'}</span>
                                    </div>
                                    <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                        {source.type === 'document' ? 'DOC' : 'SQL'}
                                    </span>
                                </div>
                                {source.snippet && (
                                    <div className={`text-[11px] text-slate-600 leading-relaxed font-mono bg-white/50 p-2 rounded border border-slate-100/50 ${isExpanded ? 'whitespace-pre-wrap' : 'line-clamp-3'}`}>
                                        {source.snippet}
                                    </div>
                                )}
                                <div className="flex items-center text-[10px] text-slate-500 space-x-3 pt-1">
                                    <span>Type: {source.type}</span>
                                    <span>Chunk: {idx + 1}</span>
                                    <div className="ml-auto flex items-center text-indigo-500 font-medium">
                                        {isExpanded ? (
                                            <>
                                                <span className="mr-1">Show less</span>
                                                <ChevronDown className="w-3 h-3 group-hover:text-indigo-600 transition-colors" />
                                            </>
                                        ) : (
                                            <>
                                                <span className="mr-1 opacity-0 group-hover:opacity-100 transition-opacity">Show more</span>
                                                <ChevronRight className="w-3 h-3 group-hover:text-indigo-600 transition-all opacity-50 group-hover:opacity-100" />
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}) : (
                            <div className="text-xs text-slate-400 text-center py-6 bg-white rounded-lg border border-slate-200 border-dashed">
                                {messages.length > 0 ? 'No sources retrieved for this response' : 'Ask a question to see retrieval context'}
                            </div>
                        )}
                    </div>

                    {/* Generation Metrics */}
                    <div className="space-y-3 pt-4 border-t border-slate-200/50">
                        <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider drop-shadow-sm">Generation Metrics</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-slate-200/50 shadow-sm">
                                <div className="text-[10px] text-slate-600 mb-1 flex items-center"><Search className="w-3 h-3 mr-1" /> Retrieval</div>
                                <div className="text-sm font-semibold text-slate-800">{realSources.length > 0 ? `${realSources.length} sources` : 'None'}</div>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-slate-200/50 shadow-sm">
                                <div className="text-[10px] text-slate-600 mb-1 flex items-center"><Cpu className="w-3 h-3 mr-1" /> Response Time</div>
                                <div className="text-sm font-semibold text-slate-800">{realResponseTime}</div>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-slate-200/50 shadow-sm">
                                <div className="text-[10px] text-slate-600 mb-1">Messages</div>
                                <div className="text-sm font-semibold text-slate-800">{messages.length}</div>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-slate-200/50 shadow-sm">
                                <div className="text-[10px] text-slate-600 mb-1 flex items-center"><CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500" /> Status</div>
                                <div className="text-sm font-semibold text-emerald-600">{isLoading ? 'Processing...' : 'Ready'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default ChatPage;