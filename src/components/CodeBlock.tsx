import React from 'react';

interface CodeBlockProps {
    title: string;
    code: string;
    language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ title, code }) => {
    return (
        <div className="my-4 rounded-lg overflow-hidden border border-slate-700 bg-[#1e1e1e] shadow-lg">
            <div className="bg-slate-800 px-4 py-2 text-xs font-mono text-slate-400 border-b border-slate-700 flex justify-between items-center">
                <span>{title}</span>
                <span className="text-[10px] uppercase tracking-wider">Config</span>
            </div>
            <div className="p-4 overflow-x-auto">
                <pre className="text-sm font-mono text-blue-100 leading-relaxed">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );
};
