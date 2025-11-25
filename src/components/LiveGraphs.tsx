import React, { useMemo } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface LiveGraphsProps {
  rpsHistory: number[];
  totalRequests: number;
  blockedRequests: number;
  allowedRequests: number;
  bannedIpsCount: number;
}

export const LiveGraphs: React.FC<LiveGraphsProps> = ({
  rpsHistory,
  totalRequests,
  blockedRequests,
  allowedRequests,
  bannedIpsCount,
}) => {
  const rpsChartData = useMemo(() => ({
    labels: Array.from({ length: 30 }, (_, i) => `${i}s`),
    datasets: [
      {
        label: 'Requests Per Second',
        data: rpsHistory,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }), [rpsHistory]);

  const statusChartData = useMemo(() => ({
    labels: ['Allowed (200)', 'Blocked (4xx/5xx)'],
    datasets: [
      {
        data: [allowedRequests, blockedRequests],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  }), [allowedRequests, blockedRequests]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#fff',
        bodyColor: '#cbd5e1',
        borderColor: '#475569',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(71, 85, 105, 0.3)',
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: 10,
          },
        },
      },
      x: {
        grid: {
          color: 'rgba(71, 85, 105, 0.1)',
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: 9,
          },
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          color: '#cbd5e1',
          font: {
            size: 10,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#fff',
        bodyColor: '#cbd5e1',
        borderColor: '#475569',
        borderWidth: 1,
      },
    },
  };

  return (
    <div className="bg-slate-900/30 border-t border-slate-800 p-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-bold text-slate-400 uppercase">📊 Live Analytics</span>
        <div className="flex-1 h-px bg-slate-800"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* RPS Over Time */}
        <div className="lg:col-span-2 bg-slate-900 p-4 rounded border border-slate-700">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-xs font-bold text-blue-400 uppercase">Requests Per Second (Last 30s)</h4>
            <span className="text-[10px] font-mono text-slate-500">{rpsHistory[rpsHistory.length - 1]} RPS</span>
          </div>
          <div className="h-40">
            <Line data={rpsChartData} options={chartOptions} />
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-slate-900 p-4 rounded border border-slate-700">
          <h4 className="text-xs font-bold text-purple-400 uppercase mb-2">Request Status Distribution</h4>
          <div className="h-40">
            <Doughnut data={statusChartData} options={doughnutOptions} />
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-[10px]">
            <div className="bg-green-900/20 p-2 rounded border border-green-700/30 text-center">
              <div className="text-green-400 font-bold">{allowedRequests}</div>
              <div className="text-slate-500">Allowed</div>
            </div>
            <div className="bg-red-900/20 p-2 rounded border border-red-700/30 text-center">
              <div className="text-red-400 font-bold">{blockedRequests}</div>
              <div className="text-slate-500">Blocked</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="lg:col-span-3 grid grid-cols-3 gap-3">
          <div className="bg-slate-900 p-3 rounded border border-slate-700">
            <div className="text-[10px] text-slate-500 uppercase mb-1">Total Requests</div>
            <div className="text-2xl font-mono text-white">{totalRequests}</div>
          </div>
          <div className="bg-slate-900 p-3 rounded border border-slate-700">
            <div className="text-[10px] text-slate-500 uppercase mb-1">Banned IPs</div>
            <div className="text-2xl font-mono text-red-400">{bannedIpsCount}</div>
          </div>
          <div className="bg-slate-900 p-3 rounded border border-slate-700">
            <div className="text-[10px] text-slate-500 uppercase mb-1">Block Rate</div>
            <div className="text-2xl font-mono text-amber-400">
              {totalRequests > 0 ? Math.round((blockedRequests / totalRequests) * 100) : 0}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
