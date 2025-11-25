import React from 'react';

interface TrafficGraphProps {
  data: number[];
  color?: string;
  height?: number;
}

export const TrafficGraph: React.FC<TrafficGraphProps> = ({ data, color = '#3b82f6', height = 60 }) => {
  const max = Math.max(...data, 10);
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (val / max) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full bg-slate-900/50 rounded border border-slate-700/50 overflow-hidden relative" style={{ height: `${height}px` }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full opacity-80">
        <path
          d={`M0,100 L${points} L100,100 Z`}
          fill={color}
          fillOpacity="0.2"
        />
        <path
          d={`M0,100 ${points}`}
          fill="none"
          stroke={color}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="absolute top-1 right-2 text-[10px] font-mono text-slate-400">
        Max: {max} RPS
      </div>
    </div>
  );
};
