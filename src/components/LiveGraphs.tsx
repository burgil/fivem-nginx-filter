import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { BarChart3 } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LiveGraphsProps {
  rpsHistory: number[];
  udpHistory: number[];
  tcpHistory: number[];
  totalRequests: number;
  blockedRequests: number;
  allowedRequests: number;
  bannedIpsCount: number;
}

export const LiveGraphs: React.FC<LiveGraphsProps> = ({
  rpsHistory,
  udpHistory,
  tcpHistory,
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

  const packetChartData = useMemo(() => ({
    labels: Array.from({ length: 30 }, (_, i) => `${i}s`),
    datasets: [
      {
        label: 'UDP Packets/s',
        data: udpHistory,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'TCP Packets/s',
        data: tcpHistory,
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }), [udpHistory, tcpHistory]);

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

  return (
    <div className="bg-slate-900/30 border-t border-slate-800 p-4">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-bold text-slate-400 uppercase">Live Analytics</span>
        <div className="flex-1 h-px bg-slate-800"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* RPS Over Time */}
        <div className="bg-slate-900 p-4 rounded border border-slate-700">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-xs font-bold text-blue-400 uppercase">HTTP Requests Per Second</h4>
            <span className="text-[10px] font-mono text-slate-500">{rpsHistory[rpsHistory.length - 1]} RPS</span>
          </div>
          <div className="h-40">
            <Line data={rpsChartData} options={chartOptions} />
          </div>
        </div>

        {/* UDP/TCP Packets Over Time */}
        <div className="bg-slate-900 p-4 rounded border border-slate-700">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-xs font-bold text-purple-400 uppercase">Network Packets Per Second</h4>
            <div className="flex gap-3 text-[10px] font-mono">
              <span className="text-blue-400">UDP: {udpHistory[udpHistory.length - 1]}/s</span>
              <span className="text-purple-400">TCP: {tcpHistory[tcpHistory.length - 1]}/s</span>
            </div>
          </div>
          <div className="h-40">
            <Line data={packetChartData} options={chartOptions} />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="lg:col-span-2 grid grid-cols-4 gap-3">
          <div className="bg-slate-900 p-3 rounded border border-slate-700">
            <div className="text-[10px] text-slate-500 uppercase mb-1">Total Requests</div>
            <div className="text-2xl font-mono text-white">{totalRequests}</div>
          </div>
          <div className="bg-slate-900 p-3 rounded border border-slate-700">
            <div className="text-[10px] text-slate-500 uppercase mb-1">Allowed</div>
            <div className="text-2xl font-mono text-green-400">{allowedRequests}</div>
          </div>
          <div className="bg-slate-900 p-3 rounded border border-slate-700">
            <div className="text-[10px] text-slate-500 uppercase mb-1">Blocked</div>
            <div className="text-2xl font-mono text-red-400">{blockedRequests}</div>
          </div>
          <div className="bg-slate-900 p-3 rounded border border-slate-700">
            <div className="text-[10px] text-slate-500 uppercase mb-1">Banned IPs</div>
            <div className="text-2xl font-mono text-amber-400">{bannedIpsCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
