import React from 'react';
import { Database, FileText } from 'lucide-react';

const SourceCard = ({ sources }) => {
    if (!sources || sources.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2 mt-3">
            {sources.map((source, index) => (
                <div
                    key={index}
                    className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs bg-white border border-slate-200 text-slate-600 shadow-sm"
                >
                    {source.type === 'database' ? (
                        <Database size={12} className="text-emerald-500" />
                    ) : (
                        <FileText size={12} className="text-primary-500" />
                    )}
                    <span className="capitalize font-medium">
                        {source.type === 'database' ? '🗃️ ' : '📄 '}
                        {source.name}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default SourceCard;
