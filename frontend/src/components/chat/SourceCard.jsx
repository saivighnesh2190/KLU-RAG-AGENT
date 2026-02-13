import React from 'react';
import { Database, FileText } from 'lucide-react';

const SourceCard = ({ sources }) => {
    if (!sources || sources.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2 mt-3">
            {sources.map((source, index) => (
                <div
                    key={index}
                    className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs bg-dark-700/50 border border-dark-600 text-dark-300"
                >
                    {source.type === 'database' ? (
                        <Database size={12} className="text-green-400" />
                    ) : (
                        <FileText size={12} className="text-primary-400" />
                    )}
                    <span className="capitalize">
                        {source.type === 'database' ? '🗃️ ' : '📄 '}
                        {source.name}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default SourceCard;
