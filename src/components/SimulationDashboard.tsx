import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TrafficGraph } from './TrafficGraph';

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
  const [isAttacking, setIsAttacking] = useState(false);
  const [playerCount, setPlayerCount] = useState(0);
  const [autoBanEnabled, setAutoBanEnabled] = useState(true);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [selectedIp, setSelectedIp] = useState<string | null>(null);
  const [rpsHistory, setRpsHistory] = useState<number[]>(new Array(30).fill(0));
  
  // Refs
  const eventIdRef = useRef(0);
  const statsRef = useRef(stats);
  const bannedRef = useRef(bannedIps);
  const ipHistoryRef = useRef<IpHistory>({});
  
  // Sync refs
  useEffect(() => { statsRef.current = stats; }, [stats]);
  useEffect(() => { bannedRef.current = bannedIps; }, [bannedIps]);

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

    // Update IP History
    if (!ipHistoryRef.current[evt.ip]) {
      ipHistoryRef.current[evt.ip] = { count: 0, lastSeen: 0, statusCodes: {} };
    }
    const ipData = ipHistoryRef.current[evt.ip];
    ipData.count++;
    ipData.lastSeen = Date.now();
    ipData.statusCodes[evt.status] = (ipData.statusCodes[evt.status] || 0) + 1;

    return evt;
  }, []);

  // Main Loop
  useEffect(() => {
    let tickCount = 0;
    const interval = setInterval(() => {
      tickCount++;
      let currentTickRequests = 0;

      // 1. Simulate Players (Good Traffic)
      if (playerCount > 0) {
        // Random chance per player to send a heartbeat
        if (Math.random() < 0.4) {
           const numReqs = Math.ceil(playerCount / 5);
           for(let i=0; i<numReqs; i++) {
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
             currentTickRequests++;
           }
        }
      }

      // 2. Simulate Attack (Bad Traffic)
      if (isAttacking) {
        const attackRate = 15; 
        for (let i = 0; i < attackRate; i++) {
          const ip = randomIp();
          const isBanned = bannedRef.current.includes(ip);
          
          if (autoBanEnabled && !isBanned && Math.random() > 0.7) {
             setBannedIps(prev => [...prev, ip]);
             addEvent({ ip, type: 'ban', status: 403, path: 'FIREWALL_BLOCK', method: 'BAN' });
             setAlerts(prev => [`[${new Date().toLocaleTimeString()}] Auto-banned ${ip} for flood pattern`, ...prev].slice(0, 5));
             continue;
          }

          if (isBanned) {
             if (Math.random() > 0.95) { 
                addEvent({ ip, status: 444, path: '/(blocked)', type: 'bad' });
             }
          } else {
             addEvent({ ip, status: 502, path: '/wp-login.php', type: 'attack' });
             currentTickRequests++;
          }
        }
      }
      
      // Update RPS Graph every second (approx 5 ticks)
      if (tickCount % 5 === 0) {
        const currentRps = Math.floor(Math.random() * (playerCount + (isAttacking ? 100 : 0))); // Simulated RPS variation
        setStats(prev => ({ ...prev, rps: currentRps }));
        setRpsHistory(prev => [...prev.slice(1), currentRps]);
      }

    }, 200); 

    return () => clearInterval(interval);
  }, [playerCount, isAttacking, autoBanEnabled, addEvent]);


  // --- Handlers ---
  const toggleAttack = () => setIsAttacking(!isAttacking);
  // const clearBans = () => setBannedIps([]);
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

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden shadow-2xl my-8 flex flex-col lg:flex-row">
      
      {/* Left Sidebar: Controls */}
      <div className="w-full lg:w-80 bg-slate-800/50 border-r border-slate-700 p-6 flex flex-col gap-6">
        
        {/* Status Card */}
        <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
          <div className="text-xs text-slate-400 uppercase font-bold mb-2">System Status</div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-2xl font-mono text-white">{stats.rps} <span className="text-sm text-slate-500">RPS</span></span>
            <div className={`w-3 h-3 rounded-full ${isAttacking ? 'bg-red-500 animate-ping' : 'bg-green-500'}`}></div>
          </div>
          <TrafficGraph data={rpsHistory} color={isAttacking ? '#ef4444' : '#3b82f6'} height={40} />
        </div>

        {/* Player Controls */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-3">
            Simulate Players
          </label>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <button onClick={() => setPlayerCount(0)} className={`text-xs py-1 px-2 rounded border ${playerCount === 0 ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-600 text-slate-400'}`}>0</button>
            <button onClick={() => setPlayerCount(10)} className={`text-xs py-1 px-2 rounded border ${playerCount === 10 ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-600 text-slate-400'}`}>10</button>
            <button onClick={() => setPlayerCount(100)} className={`text-xs py-1 px-2 rounded border ${playerCount === 100 ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-600 text-slate-400'}`}>100</button>
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
              className={`w-full py-2 px-4 rounded font-bold text-xs transition-all border ${
                isAttacking 
                  ? 'bg-red-500/20 text-red-400 border-red-500 animate-pulse' 
                  : 'bg-slate-700 text-slate-300 border-transparent hover:bg-slate-600'
              }`}
            >
              {isAttacking ? 'STOP DDoS ATTACK' : 'START DDoS ATTACK'}
            </button>
            <button 
              onClick={sendBadPacket}
              className="w-full py-2 px-4 rounded font-bold text-xs bg-slate-700 text-amber-400 border border-transparent hover:border-amber-400/50 transition-all"
            >
              SEND BAD PACKET (Exploit)
            </button>
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
          <div className="text-[10px] text-slate-500">
            LIVE LOG STREAM
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
                className={`flex items-center border-b border-slate-900/50 hover:bg-slate-800/50 transition-colors cursor-pointer ${
                  e.type === 'attack' ? 'text-red-400/80' : 
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
                Waiting for traffic... <br/>
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
      </div>
    </div>
  );
};
