import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TrafficGraph } from './TrafficGraph';
import { LiveGraphs } from './LiveGraphs';

// --- Types ---
interface SimEvent {
  id: number;
  ts: number;
  ip: string;
  method: string;
  path: string;
  status: number;
  ua: string;
  type: 'good' | 'bad' | 'attack' | 'ban';
}

interface DashboardStats {
  totalRequests: number;
  blockedRequests: number;
  allowedRequests: number;
  activeConnections: number;
  rps: number;
}

interface IpHistory {
  [ip: string]: {
    count: number;
    lastSeen: number;
    statusCodes: { [code: number]: number };
    timestamps: number[]; // Track request timestamps for windowed rate limiting
  };
}

// --- Helper Functions ---
const randomIp = () => `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
const randomUa = () => {
  const uas = ['Mozilla/5.0 (Windows NT 10.0)', 'FiveM/2699', 'CitizenFX/1.0', 'Python-urllib/3.8', 'curl/7.68.0', 'Go-http-client/1.1'];
  return uas[Math.floor(Math.random() * uas.length)];
};

export const SimulationDashboard: React.FC = () => {
  // --- State ---
  const [events, setEvents] = useState<SimEvent[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalRequests: 0,
    blockedRequests: 0,
    allowedRequests: 0,
    activeConnections: 0,
    rps: 0,
  });
  const [bannedIps, setBannedIps] = useState<string[]>([]);
  const [whitelistedIps, setWhitelistedIps] = useState<string[]>(['192.168.0.1']);
  const [isAttacking, setIsAttacking] = useState(false);
  const [playerCount, setPlayerCount] = useState(0);
  const [autoBanEnabled, setAutoBanEnabled] = useState(true);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [selectedIp, setSelectedIp] = useState<string | null>(null);
  const [rpsHistory, setRpsHistory] = useState<number[]>(new Array(30).fill(0));
  const [udpPacketRate, setUdpPacketRate] = useState(0);
  const [tcpPacketRate, setTcpPacketRate] = useState(0);
  const [rateLimitPerSecond, setRateLimitPerSecond] = useState(10);
  const [rateLimitPer10Sec, setRateLimitPer10Sec] = useState(50);
  const [rateLimitPerMinute, setRateLimitPerMinute] = useState(200);
  const [burstAllowance, setBurstAllowance] = useState(20);
  const [isUdpFlooding, setIsUdpFlooding] = useState(false);
  const [isTcpFlooding, setIsTcpFlooding] = useState(false);

  // Refs
  const eventIdRef = useRef(0);
  const statsRef = useRef(stats);
  const bannedRef = useRef(bannedIps);
  const whitelistedRef = useRef(whitelistedIps);
  const ipHistoryRef = useRef<IpHistory>({});

  // Sync refs
  useEffect(() => { statsRef.current = stats; }, [stats]);
  useEffect(() => { bannedRef.current = bannedIps; }, [bannedIps]);
  useEffect(() => { whitelistedRef.current = whitelistedIps; }, [whitelistedIps]);

  // --- Helper: Check if IP exceeds rate limits ---
  const checkRateLimitViolation = useCallback((ip: string): { violated: boolean; reason: string } => {
    const ipData = ipHistoryRef.current[ip];
    if (!ipData || !ipData.timestamps.length) return { violated: false, reason: '' };

    const now = Date.now();
    const last1s = ipData.timestamps.filter(t => t > now - 1000).length;
    const last10s = ipData.timestamps.filter(t => t > now - 10000).length;
    const last60s = ipData.timestamps.filter(t => t > now - 60000).length;

    if (last1s > rateLimitPerSecond) {
      return { violated: true, reason: `${last1s} req/s (limit: ${rateLimitPerSecond})` };
    }
    if (last10s > rateLimitPer10Sec) {
      return { violated: true, reason: `${last10s} req/10s (limit: ${rateLimitPer10Sec})` };
    }
    if (last60s > rateLimitPerMinute) {
      return { violated: true, reason: `${last60s} req/min (limit: ${rateLimitPerMinute})` };
    }

    return { violated: false, reason: '' };
  }, [rateLimitPerSecond, rateLimitPer10Sec, rateLimitPerMinute]);

  // --- Simulation Logic ---
  const addEvent = useCallback((partial: Partial<SimEvent>) => {
    const id = ++eventIdRef.current;
    const evt: SimEvent = {
      id,
      ts: Date.now(),
      ip: partial.ip || randomIp(),
      method: partial.method || 'GET',
      path: partial.path || '/',
      status: partial.status || 200,
      ua: partial.ua || randomUa(),
      type: partial.type || 'good',
    };

    setEvents(prev => [evt, ...prev].slice(0, 50));

    // Update Stats
    setStats(prev => ({
      ...prev,
      totalRequests: prev.totalRequests + 1,
      blockedRequests: prev.blockedRequests + (evt.status !== 200 ? 1 : 0),
      allowedRequests: prev.allowedRequests + (evt.status === 200 ? 1 : 0),
    }));

    // Update IP History with windowed tracking
    if (!ipHistoryRef.current[evt.ip]) {
      ipHistoryRef.current[evt.ip] = { count: 0, lastSeen: 0, statusCodes: {}, timestamps: [] };
    }
    const ipData = ipHistoryRef.current[evt.ip];
    ipData.count++;
    ipData.lastSeen = Date.now();
    ipData.statusCodes[evt.status] = (ipData.statusCodes[evt.status] || 0) + 1;
    ipData.timestamps.push(Date.now());

    // Keep only last 60 seconds of timestamps
    const cutoff = Date.now() - 60000;
    ipData.timestamps = ipData.timestamps.filter(t => t > cutoff);

    return evt;
  }, []);

  // Main Loop
  useEffect(() => {
    let tickCount = 0;
    const interval = setInterval(() => {
      tickCount++;

      // 1. Simulate Players (Good Traffic)
      if (playerCount > 0) {
        // Random chance per player to send a heartbeat
        if (Math.random() < 0.4) {
          const numReqs = Math.ceil(playerCount / 5);
          for (let i = 0; i < numReqs; i++) {
            const ip = `10.0.0.${(i % 100) + 100}`;
            if (bannedRef.current.includes(ip)) continue;

            addEvent({
              ip,
              path: '/info.json',
              method: 'GET',
              status: 200,
              ua: 'CitizenFX/1.0',
              type: 'good'
            });
          }
        }
      }

      // 2. Simulate Attack (Bad Traffic)
      if (isAttacking) {
        const attackRate = 15;
        for (let i = 0; i < attackRate; i++) {
          const ip = randomIp();
          const isWhitelisted = whitelistedRef.current.includes(ip);
          const isBanned = bannedRef.current.includes(ip);

          if (isWhitelisted) continue; // Skip whitelisted IPs

          // Check rate limit violations for auto-ban
          if (autoBanEnabled && !isBanned) {
            const rateCheck = checkRateLimitViolation(ip);
            if (rateCheck.violated) {
              setBannedIps(prev => [...prev, ip]);
              addEvent({ ip, type: 'ban', status: 403, path: 'IPTABLES_DROP', method: 'BAN' });
              setAlerts(prev => [`[${new Date().toLocaleTimeString()}] Banned ${ip} - ${rateCheck.reason}`, ...prev].slice(0, 5));
              continue;
            }
          }

          if (isBanned) {
            if (Math.random() > 0.95) {
              addEvent({ ip, status: 444, path: '/(blocked)', type: 'bad' });
            }
          } else {
            addEvent({ ip, status: 502, path: '/wp-login.php', type: 'attack' });
          }
        }
      }

      // 3. UDP Flood Simulation
      if (isUdpFlooding) {
        const floodIps = Array.from({ length: 20 }, () => randomIp());
        floodIps.forEach(ip => {
          const isWhitelisted = whitelistedRef.current.includes(ip);
          const isBanned = bannedRef.current.includes(ip);
          if (isWhitelisted) return;

          if (autoBanEnabled && !isBanned) {
            const rateCheck = checkRateLimitViolation(ip);
            if (rateCheck.violated) {
              setBannedIps(prev => [...prev, ip]);
              addEvent({ ip, type: 'ban', status: 403, path: 'IPTABLES_DROP', method: 'BAN' });
              setAlerts(prev => [`[${new Date().toLocaleTimeString()}] Banned ${ip} - UDP flood ${rateCheck.reason}`, ...prev].slice(0, 5));
              return;
            }
          }

          if (!isBanned) {
            addEvent({ ip, path: 'UDP:30120', method: 'FLOOD', status: 444, type: 'attack', ua: 'UDP_PACKET' });
          }
        });
      }

      // 4. TCP SYN Flood Simulation
      if (isTcpFlooding) {
        const synIps = Array.from({ length: 10 }, () => randomIp());
        synIps.forEach(ip => {
          const isWhitelisted = whitelistedRef.current.includes(ip);
          const isBanned = bannedRef.current.includes(ip);
          if (isWhitelisted) return;

          if (autoBanEnabled && !isBanned) {
            const rateCheck = checkRateLimitViolation(ip);
            if (rateCheck.violated) {
              setBannedIps(prev => [...prev, ip]);
              addEvent({ ip, type: 'ban', status: 403, path: 'IPTABLES_DROP', method: 'BAN' });
              setAlerts(prev => [`[${new Date().toLocaleTimeString()}] Banned ${ip} - SYN flood ${rateCheck.reason}`, ...prev].slice(0, 5));
              return;
            }
          }

          if (!isBanned) {
            addEvent({ ip, path: 'TCP:30120', method: 'SYN', status: 444, type: 'attack', ua: 'TCP_SYN' });
          }
        });
      }

      // Update RPS Graph every second (approx 5 ticks)
      if (tickCount % 5 === 0) {
        const baseRps = playerCount + (isAttacking ? 100 : 0);
        const udpRps = isUdpFlooding ? 200 : 0;
        const tcpRps = isTcpFlooding ? 100 : 0;
        const currentRps = baseRps + udpRps + tcpRps + Math.floor(Math.random() * 50);
        setStats(prev => ({ ...prev, rps: currentRps }));
        setRpsHistory(prev => [...prev.slice(1), currentRps]);

        // Simulate UDP/TCP packet rates
        const baseUdp = playerCount * 20;
        const baseTcp = playerCount * 2;
        setUdpPacketRate(baseUdp + (isAttacking ? Math.floor(Math.random() * 500) : 0) + (isUdpFlooding ? 5000 : 0));
        setTcpPacketRate(baseTcp + (isAttacking ? Math.floor(Math.random() * 50) : 0) + (isTcpFlooding ? 2000 : 0));
      }

    }, 200);

    return () => clearInterval(interval);
  }, [playerCount, isAttacking, autoBanEnabled, isUdpFlooding, isTcpFlooding, addEvent, checkRateLimitViolation]);


  // --- Handlers ---
  const toggleAttack = () => setIsAttacking(!isAttacking);

  const resetSimulation = () => {
    setEvents([]);
    setStats({
      totalRequests: 0,
      blockedRequests: 0,
      allowedRequests: 0,
      activeConnections: 0,
      rps: 0,
    });
    setBannedIps([]);
    setAlerts([]);
    setRpsHistory(new Array(30).fill(0));
    ipHistoryRef.current = {};
    setPlayerCount(0);
    setIsAttacking(false);
    setIsUdpFlooding(false);
    setIsTcpFlooding(false);
    setUdpPacketRate(0);
    setTcpPacketRate(0);
  };

  const clearLogs = () => {
    setEvents([]);
    setAlerts([]);
  };

  const banIp = (ip: string) => {
    if (!bannedIps.includes(ip)) {
      setBannedIps([...bannedIps, ip]);
      setAlerts(prev => [`[${new Date().toLocaleTimeString()}] Manual ban: ${ip}`, ...prev].slice(0, 5));
    }
  };

  const sendBadPacket = () => {
    addEvent({
      ip: randomIp(),
      path: '/.env',
      method: 'GET',
      status: 403,
      type: 'bad',
      ua: 'curl/7.68.0'
    });
  };

  const sendGoodPacket = () => {
    addEvent({
      ip: randomIp(),
      path: '/players.json',
      method: 'GET',
      status: 200,
      type: 'good',
      ua: 'CitizenFX/1.0'
    });
  };

  return (
    <div className="space-y-4 my-8">
      {/* Warning Disclaimer */}
      <div className="bg-amber-900/20 border border-amber-700/50 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">⚠️</div>
          <div>
            <h3 className="text-amber-400 font-bold mb-1">Educational Client-Sided Simulation Only</h3>
            <p className="text-sm text-slate-300">
              This is a client-side visualization to demonstrate how firewall rules work. 
              No actual traffic is generated. Real DDoS mitigation requires server-side configuration 
              with iptables, fail2ban, and proper nginx/CloudFlare settings.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden shadow-2xl flex flex-col lg:flex-row">

        {/* Left Sidebar: Controls */}
        <div className="w-full lg:w-80 bg-slate-800/50 border-r border-slate-700 p-6 flex flex-col gap-6">

        {/* Status Card */}
        <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs text-slate-400 uppercase font-bold">System Status</div>
          </div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-2xl font-mono text-white">{stats.rps} <span className="text-sm text-slate-500">RPS</span></span>
            <div className={`w-3 h-3 rounded-full ${isAttacking ? 'bg-red-500 animate-ping' : 'bg-green-500'}`}></div>
          </div>
          <TrafficGraph data={rpsHistory} color={isAttacking ? '#ef4444' : '#3b82f6'} height={40} />
          <div className="grid grid-cols-2 gap-2 mt-2 text-[10px]">
            <div className="bg-black/30 p-1.5 rounded">
              <div className="text-slate-500">UDP</div>
              <div className="text-blue-400 font-mono font-bold">{udpPacketRate}/s</div>
            </div>
            <div className="bg-black/30 p-1.5 rounded">
              <div className="text-slate-500">TCP</div>
              <div className="text-purple-400 font-mono font-bold">{tcpPacketRate}/s</div>
            </div>
          </div>
        </div>

        {/* Player Controls */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-3">
            Simulate Players
          </label>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <button onClick={() => setPlayerCount(0)} className={`text-xs py-2 px-2 rounded font-bold transition-all ${playerCount === 0 ? 'bg-blue-600 border-2 border-blue-400 text-white shadow-lg shadow-blue-500/50' : 'bg-slate-800 border-2 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white'}`}>0</button>
            <button onClick={() => setPlayerCount(10)} className={`text-xs py-2 px-2 rounded font-bold transition-all ${playerCount === 10 ? 'bg-blue-600 border-2 border-blue-400 text-white shadow-lg shadow-blue-500/50' : 'bg-slate-800 border-2 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white'}`}>10</button>
            <button onClick={() => setPlayerCount(100)} className={`text-xs py-2 px-2 rounded font-bold transition-all ${playerCount === 100 ? 'bg-blue-600 border-2 border-blue-400 text-white shadow-lg shadow-blue-500/50' : 'bg-slate-800 border-2 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white'}`}>100</button>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            value={playerCount}
            onChange={(e) => setPlayerCount(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="text-right text-xs text-blue-400 font-mono mt-1">{playerCount} Active</div>
        </div>

        {/* Attack Controls */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-3">
            Threat Simulation
          </label>
          <div className="space-y-2">
            <button
              onClick={toggleAttack}
              className={`w-full py-2 px-3 rounded font-bold text-xs transition-all ${isAttacking
                  ? 'bg-red-600 text-white border border-red-400 animate-pulse'
                  : 'bg-slate-700 text-slate-300 border border-slate-600 hover:border-slate-500 hover:bg-slate-600'
                }`}
            >
              {isAttacking ? '🛑 STOP DDoS' : '⚔️ START DDoS'}
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={sendBadPacket}
                className="w-full py-2 px-2 rounded font-bold text-[10px] bg-amber-600/20 text-amber-400 border border-amber-600/50 hover:border-amber-500 hover:bg-amber-600/30 transition-all"
              >
                ⚠️ BAD HTTP
              </button>
              <button
                onClick={sendGoodPacket}
                className="w-full py-2 px-2 rounded font-bold text-[10px] bg-green-600/20 text-green-400 border border-green-600/50 hover:border-green-500 hover:bg-green-600/30 transition-all"
              >
                ✅ GOOD HTTP
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setIsUdpFlooding(!isUdpFlooding);
                  if (!isUdpFlooding) {
                    setAlerts(prev => [`[${new Date().toLocaleTimeString()}] UDP Flood started - 5000+ pps`, ...prev].slice(0, 5));
                  } else {
                    setAlerts(prev => [`[${new Date().toLocaleTimeString()}] UDP Flood stopped`, ...prev].slice(0, 5));
                  }
                }}
                className={`w-full py-2 px-2 rounded font-bold text-[10px] transition-all ${isUdpFlooding
                    ? 'bg-blue-600 text-white border border-blue-400 animate-pulse'
                    : 'bg-blue-600/20 text-blue-400 border border-blue-600/50 hover:border-blue-500 hover:bg-blue-600/30'
                  }`}
              >
                {isUdpFlooding ? '🛑 STOP UDP' : '📡 UDP FLOOD'}
              </button>
              <button
                onClick={() => {
                  setIsTcpFlooding(!isTcpFlooding);
                  if (!isTcpFlooding) {
                    setAlerts(prev => [`[${new Date().toLocaleTimeString()}] TCP SYN Flood started - 2000+ cps`, ...prev].slice(0, 5));
                  } else {
                    setAlerts(prev => [`[${new Date().toLocaleTimeString()}] TCP SYN Flood stopped`, ...prev].slice(0, 5));
                  }
                }}
                className={`w-full py-2 px-2 rounded font-bold text-[10px] transition-all ${isTcpFlooding
                    ? 'bg-purple-600 text-white border border-purple-400 animate-pulse'
                    : 'bg-purple-600/20 text-purple-400 border border-purple-600/50 hover:border-purple-500 hover:bg-purple-600/30'
                  }`}
              >
                {isTcpFlooding ? '🛑 STOP TCP' : '🔌 TCP SYN'}
              </button>
            </div>
          </div>
        </div>

        {/* Firewall Toggle */}
        <div className="flex items-center justify-between bg-slate-900 p-3 rounded border border-slate-700">
          <span className="text-xs font-bold text-slate-300">AUTO-BAN ENGINE</span>
          <button
            onClick={() => setAutoBanEnabled(!autoBanEnabled)}
            className={`w-8 h-4 rounded-full transition-colors relative ${autoBanEnabled ? 'bg-green-500' : 'bg-slate-600'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${autoBanEnabled ? 'translate-x-4' : ''}`} />
          </button>
        </div>

        {/* Rate Limit Configuration */}
        <div className="bg-slate-900 p-3 rounded border border-slate-700 space-y-2">
          <div className="text-[10px] font-bold text-amber-400 uppercase mb-2 flex items-center gap-1">
            <span>⚙️</span> Advanced Rate Limits
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] font-bold text-slate-400">Per Second</span>
              <span className="text-[10px] font-mono text-blue-400">{rateLimitPerSecond} req/s</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              value={rateLimitPerSecond}
              onChange={(e) => setRateLimitPerSecond(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] font-bold text-slate-400">Per 10 Seconds</span>
              <span className="text-[10px] font-mono text-purple-400">{rateLimitPer10Sec} req/10s</span>
            </div>
            <input
              type="range"
              min="20"
              max="300"
              step="10"
              value={rateLimitPer10Sec}
              onChange={(e) => setRateLimitPer10Sec(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] font-bold text-slate-400">Per Minute</span>
              <span className="text-[10px] font-mono text-green-400">{rateLimitPerMinute} req/min</span>
            </div>
            <input
              type="range"
              min="50"
              max="1000"
              step="50"
              value={rateLimitPerMinute}
              onChange={(e) => setRateLimitPerMinute(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] font-bold text-slate-400">Burst Allowance</span>
              <span className="text-[10px] font-mono text-amber-400">{burstAllowance} burst</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={burstAllowance}
              onChange={(e) => setBurstAllowance(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>
          <div className="text-[8px] text-slate-500 pt-1 border-t border-slate-800">
            Auto-ban triggers when any limit is exceeded
          </div>
        </div>

        {/* IP Management */}
        <div className="bg-slate-900 p-3 rounded border border-slate-700">
          <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">IP Management</div>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="192.168.x.x"
                className="flex-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-[10px] text-white focus:outline-none focus:border-blue-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value) {
                    const ip = e.currentTarget.value;
                    if (!whitelistedIps.includes(ip)) {
                      setWhitelistedIps(prev => [...prev, ip]);
                      setAlerts(prev => [`[${new Date().toLocaleTimeString()}] Whitelisted ${ip}`, ...prev].slice(0, 5));
                    }
                    e.currentTarget.value = '';
                  }
                }}
              />
              <button className="px-2 py-1 bg-green-600/20 text-green-400 border border-green-600/50 rounded text-[9px] font-bold hover:bg-green-600/30">
                + WL
              </button>
            </div>
            <div className="max-h-20 overflow-y-auto text-[9px] font-mono space-y-1">
              {whitelistedIps.map(ip => (
                <div key={ip} className="flex items-center justify-between bg-green-900/10 border border-green-700/30 rounded px-2 py-0.5">
                  <span className="text-green-400">{ip}</span>
                  <button
                    onClick={() => setWhitelistedIps(prev => prev.filter(i => i !== ip))}
                    className="text-red-400 hover:text-red-300 text-[8px]"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Banned IPs List */}
        <div className="bg-slate-900 p-3 rounded border border-slate-700">
          <div className="flex justify-between items-center mb-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Banned IPs ({bannedIps.length})</div>
            <button
              onClick={() => {
                setBannedIps([]);
                setAlerts(prev => [`[${new Date().toLocaleTimeString()}] Cleared all bans`, ...prev].slice(0, 5));
              }}
              className="text-[8px] px-1.5 py-0.5 bg-red-900/20 text-red-400 rounded hover:bg-red-900/40"
            >
              Clear All
            </button>
          </div>
          <div className="max-h-32 overflow-y-auto text-[9px] font-mono space-y-1">
            {bannedIps.length === 0 && <span className="text-slate-600 italic">No banned IPs</span>}
            {bannedIps.map(ip => (
              <div key={ip} className="flex items-center justify-between bg-red-900/10 border border-red-700/30 rounded px-2 py-0.5">
                <span className="text-red-400">{ip}</span>
                <button
                  onClick={() => setBannedIps(prev => prev.filter(i => i !== ip))}
                  className="text-slate-400 hover:text-white text-[8px]"
                >
                  unban
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts Panel */}
        <div className="flex-1 min-h-[100px] bg-black/40 rounded border border-slate-700/50 p-2 overflow-hidden flex flex-col">
          <div className="text-[10px] text-slate-500 font-bold mb-1">RECENT ALERTS</div>
          <div className="overflow-y-auto text-[10px] font-mono space-y-1 text-slate-300">
            {alerts.length === 0 && <span className="text-slate-600 italic">System nominal...</span>}
            {alerts.map((a, i) => <div key={i} className="border-l-2 border-red-500 pl-1">{a}</div>)}
          </div>
        </div>

      </div>

      {/* Right: Main View */}
      <div className="flex-1 flex flex-col bg-black min-h-[500px]">

        {/* Top Bar */}
        <div className="h-12 border-b border-slate-800 flex items-center px-4 justify-between bg-slate-900/50">
          <div className="flex gap-6 text-xs font-mono">
            <div>TOTAL: <span className="text-white">{stats.totalRequests}</span></div>
            <div>BLOCKED: <span className="text-red-400">{stats.blockedRequests}</span></div>
            <div>ALLOWED: <span className="text-green-400">{stats.allowedRequests}</span></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-[10px] text-slate-500 uppercase font-bold">LIVE LOG STREAM</div>
            <button onClick={clearLogs} className="px-1.5 h-5 flex items-center text-[9px] bg-slate-700/30 hover:bg-slate-700/50 text-slate-400 hover:text-slate-300 rounded transition-all">Clear</button>
            <button onClick={resetSimulation} className="px-1.5 h-5 flex items-center text-[9px] bg-red-900/10 hover:bg-red-900/20 text-red-400/70 hover:text-red-400 rounded transition-all">Reset</button>
          </div>
        </div>

        {/* Log Table */}
        <div className="flex-1 overflow-hidden flex flex-col relative">
          <div className="flex text-[10px] font-bold text-slate-500 border-b border-slate-800 bg-slate-900/30">
            <div className="w-20 p-2">TIME</div>
            <div className="w-32 p-2">SOURCE IP</div>
            <div className="w-16 p-2">METHOD</div>
            <div className="flex-1 p-2">PATH</div>
            <div className="w-16 p-2 text-right">STATUS</div>
          </div>

          <div className="flex-1 overflow-y-auto font-mono text-xs scrollbar-thin scrollbar-thumb-slate-700">
            {events.map(e => (
              <div
                key={e.id}
                className={`flex items-center border-b border-slate-900/50 hover:bg-slate-800/50 transition-colors cursor-pointer ${e.type === 'attack' ? 'text-red-400/80' :
                    e.type === 'ban' ? 'text-purple-400 font-bold bg-purple-900/10' :
                      e.status >= 400 ? 'text-amber-400' : 'text-green-400'
                  }`}
                onClick={() => setSelectedIp(e.ip)}
              >
                <div className="w-20 p-2 text-slate-600">{new Date(e.ts).toLocaleTimeString().split(' ')[0]}</div>
                <div className="w-32 p-2 font-bold">{e.ip}</div>
                <div className="w-16 p-2 opacity-75">{e.method}</div>
                <div className="flex-1 p-2 truncate opacity-90" title={e.ua}>{e.path}</div>
                <div className="w-16 p-2 text-right font-bold">{e.status}</div>
              </div>
            ))}
            {events.length === 0 && (
              <div className="p-8 text-center text-slate-600">
                Waiting for traffic... <br />
                <span className="text-xs">Use controls on the left to generate load.</span>
              </div>
            )}
          </div>

          {/* IP Detail Modal (Overlay) */}
          {selectedIp && (
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-8 z-10">
              <div className="bg-slate-800 border border-slate-600 rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
                <div className="bg-slate-900 p-4 border-b border-slate-700 flex justify-between items-center">
                  <h3 className="font-bold text-white">IP Details: {selectedIp}</h3>
                  <button onClick={() => setSelectedIp(null)} className="text-slate-400 hover:text-white">✕</button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 p-3 rounded border border-slate-700">
                      <div className="text-xs text-slate-500 uppercase">Total Requests</div>
                      <div className="text-xl font-mono text-white">{ipHistoryRef.current[selectedIp]?.count || 0}</div>
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded border border-slate-700">
                      <div className="text-xs text-slate-500 uppercase">Status</div>
                      <div className="text-xl font-mono">
                        {bannedIps.includes(selectedIp) ? <span className="text-red-500">BANNED</span> : <span className="text-green-500">CLEAN</span>}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-500 uppercase mb-2">Request History</div>
                    <div className="h-32 bg-black rounded border border-slate-700 overflow-y-auto p-2 text-xs font-mono text-slate-300">
                      {/* Filter events for this IP */}
                      {events.filter(e => e.ip === selectedIp).map(e => (
                        <div key={e.id} className="flex justify-between border-b border-slate-800 py-1">
                          <span>{e.method} {e.path}</span>
                          <span className={e.status >= 400 ? 'text-red-400' : 'text-green-400'}>{e.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    {bannedIps.includes(selectedIp) ? (
                      <button
                        onClick={() => { setBannedIps(prev => prev.filter(x => x !== selectedIp)); setSelectedIp(null); }}
                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded font-bold text-sm"
                      >
                        UNBAN IP
                      </button>
                    ) : (
                      <button
                        onClick={() => { banIp(selectedIp); setSelectedIp(null); }}
                        className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded font-bold text-sm"
                      >
                        BAN IP NOW
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Live Graphs Section */}
        <LiveGraphs
          rpsHistory={rpsHistory}
          totalRequests={stats.totalRequests}
          blockedRequests={stats.blockedRequests}
          allowedRequests={stats.allowedRequests}
          bannedIpsCount={bannedIps.length}
        />
      </div>
    </div>
    </div>
  );
};
