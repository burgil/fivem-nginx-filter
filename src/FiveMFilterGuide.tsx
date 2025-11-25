import { SimulationDashboard } from './components/SimulationDashboard';
import { CodeBlock } from './components/CodeBlock';
import { Zap, Target, Lock, BarChart3, Rocket, Gamepad2, Shield, AlertTriangle, FileText, CheckCircle, Server, Monitor } from 'lucide-react';

export default function FiveMFilterGuide() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-blue-500/30">

      {/* Hero Section */}
      <header className="bg-linear-to-r from-slate-900 to-slate-800 border-b border-slate-700 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white">F</div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              FiveM <span className="text-blue-500">Filter</span> Kit
            </h1>
          </div>

          {/* Navigation / TOC */}
          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-400">
            <button onClick={() => scrollToSection('intro')} className="hover:text-white transition-colors">Why Filter?</button>
            <button onClick={() => scrollToSection('simulation')} className="hover:text-white transition-colors text-blue-400">Live Demo</button>
            <button onClick={() => scrollToSection('prerequisites')} className="hover:text-white transition-colors">Prerequisites</button>
            <button onClick={() => scrollToSection('nginx-config')} className="hover:text-white transition-colors">Config</button>
            <button onClick={() => scrollToSection('watcher-service')} className="hover:text-white transition-colors">Watcher</button>
            <button onClick={() => scrollToSection('bonuses')} className="hover:text-white transition-colors">Bonuses</button>
          </nav>

          <div className="text-xs text-slate-500 font-mono">
            v2.1.0
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">

        {/* Hero Text */}
        <div className="text-center mb-8 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
            Stop DDoS. <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500">
              Protect Your FiveM Server.
            </span>
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            A production-ready implementation guide for deploying NGINX as a Layer 7 shield.
            Filter bad packets, rate-limit connections, and ban attackers automatically before they crash your FXServer.
          </p>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-4 mb-8 text-left">
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
              <div className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4" /> Crash Prevention
              </div>
              <p className="text-xs text-slate-400">
                Stop HTTP floods, UDP packet storms, and SYN attacks <strong>before</strong> they reach FXServer.
                Your server stays responsive even under 10,000+ req/s attacks.
              </p>
            </div>
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
              <div className="text-purple-400 font-bold mb-2 flex items-center gap-2">
                <Target className="w-4 h-4" /> Smart Rate Limiting
              </div>
              <p className="text-xs text-slate-400">
                Token-bucket algorithm with configurable limits per second/minute/burst.
                Legitimate players never hit limits, attackers get <code>503</code> instantly.
              </p>
            </div>
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
              <div className="text-green-400 font-bold mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4" /> Auto-Ban & Whitelist
              </div>
              <p className="text-xs text-slate-400">
                Node.js watcher auto-bans IPs via <code>iptables</code> based on attack patterns.
                Whitelist trusted IPs, track request history per IP.
              </p>
            </div>
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
              <div className="text-amber-400 font-bold mb-2 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" /> Real-Time Monitoring
              </div>
              <p className="text-xs text-slate-400">
                Live RPS graphs, attack distribution charts, banned IP lists.
                See exactly who's hitting your server and what they're requesting.
              </p>
            </div>
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
              <div className="text-red-400 font-bold mb-2 flex items-center gap-2">
                <Rocket className="w-4 h-4" /> Layer 4 + Layer 7
              </div>
              <p className="text-xs text-slate-400">
                HTTP proxy <strong>and</strong> UDP stream proxy.
                Filter both web requests and game packets with a single NGINX instance.
              </p>
            </div>
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
              <div className="text-cyan-400 font-bold mb-2 flex items-center gap-2">
                <Gamepad2 className="w-4 h-4" /> DDoS Simulation
              </div>
              <p className="text-xs text-slate-400">
                Interactive dashboard lets you test UDP floods, TCP SYN attacks, HTTP spam.
                See how filters respond in real-time without risking your live server.
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button onClick={() => scrollToSection('simulation')} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg shadow-blue-500/20">
              Try Interactive Demo
            </button>
            <button onClick={() => scrollToSection('nginx-config')} className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-bold border border-slate-700 transition-all">
              Get The Configs
            </button>
          </div>
        </div>

        {/* Credits */}
        <div className="flex flex-col items-center gap-1">
          <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Created By</div>
          <div className="text-2xl font-bold text-white">Burgil</div>
          <img src="/logo.webp" alt="FiveM Filter Logo" className="w-10 h-10 rounded-md object-cover" />
        </div>
        <div className="text-xs text-blue-400 text-center mt-2 mb-8">Wizard</div>

        {/* Disclaimer */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-12 flex gap-4 items-start max-w-4xl mx-auto">
          <Shield className="w-8 h-8 text-red-400 shrink-0" />
          <div>
            <h3 className="font-bold text-red-400">Security Disclaimer</h3>
            <p className="text-sm text-red-200/70 mt-1">
              This guide involves modifying core network configurations (NGINX, Firewall).
              Incorrect application can lock you out of your server.<br />
              <strong>Always test in a staging environment first.</strong> Use at your own risk.
            </p>
          </div>
        </div>

        {/* Main Guide Content */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-16 text-slate-300">

            {/* ========================================
          TABLE OF CONTENTS
      ======================================== */}
            <section className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-500" /> Table of Contents
              </h2>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-2">
                <a href="#intro" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-2 transition-colors">
                  <span className="text-slate-600">→</span> Why NGINX Filtering?
                </a>
                <a href="#simulation" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-2 transition-colors">
                  <span className="text-slate-600">→</span> Interactive Simulator
                </a>
                <a href="#prerequisites" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-2 transition-colors">
                  <span className="text-slate-600">→</span> Prerequisites
                </a>
                <a href="#installation" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-2 transition-colors">
                  <span className="text-slate-600">→</span> Installation
                </a>
                <a href="#nginx-config" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-2 transition-colors">
                  <span className="text-slate-600">→</span> NGINX HTTP Config
                </a>
                <a href="#udp-proxy" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-2 transition-colors">
                  <span className="text-slate-600">→</span> NGINX UDP Proxy
                </a>
                <a href="#server-config" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-2 transition-colors">
                  <span className="text-slate-600">→</span> FiveM Server Config
                </a>
                <a href="#watcher-service" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-2 transition-colors">
                  <span className="text-slate-600">→</span> Node.js Log Watcher
                </a>
                <a href="#log-parser" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-2 transition-colors">
                  <span className="text-slate-600">→</span> Log Parser & Stats API
                </a>
                <a href="#bonuses" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-2 transition-colors">
                  <span className="text-slate-600">→</span> Real-Time Dashboard & Graphs
                </a>
                <a href="#troubleshooting" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-2 transition-colors">
                  <span className="text-slate-600">→</span> Troubleshooting
                </a>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-700">
                <p className="text-xs text-slate-400">
                  <strong className="text-slate-300">Quick Start:</strong> New to NGINX filtering? Start with <a href="#intro" className="text-blue-400 hover:underline">Why NGINX Filtering?</a>,
                  try the <a href="#simulator" className="text-blue-400 hover:underline">Interactive Simulator</a>, then follow the setup guides in order.
                </p>
              </div>
            </section>

            {/* ========================================
          SECTION 1: WHY NGINX FILTERING?
      ======================================== */}
            <section id="intro" className="scroll-mt-24">
              <h2 className="text-4xl font-bold text-white mb-8 flex items-center gap-3">
                <span className="text-blue-500">#</span> Why NGINX Filtering?
              </h2>

              {/* The Problem */}
              <div className="bg-red-900/10 border-l-4 border-red-500 p-6 rounded-r-lg mb-8">
                <h3 className="text-xl font-bold text-red-400 mb-3">The Problem: Why FiveM Servers Are Vulnerable</h3>
                <p className="text-slate-300 leading-relaxed mb-3">
                  FiveM servers are <strong>prime targets for Layer 7 (Application Layer) and Layer 4 (Transport Layer) attacks</strong>.
                  The architecture exposes multiple attack vectors:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-400">
                  <li><strong>HTTP Endpoints (Layer 7):</strong> The server list queries <code>/info.json</code>, <code>/players.json</code>, and <code>/dynamic.json</code> every few seconds. A flood of requests to these endpoints can exhaust FXServer's HTTP handler, causing it to <strong>hang or crash</strong>, even with <code>sv_requestParanoia</code> enabled.</li>
                  <li><strong>UDP Game Traffic (Layer 4):</strong> FiveM uses UDP on port 30120 for game data (player movements, voice, syncing). A UDP flood can saturate bandwidth, causing <strong>packet loss, timeouts, and unplayable lag</strong>.</li>
                  <li><strong>TCP Handshake Attacks (SYN Flood):</strong> Attackers can exhaust your connection table with half-open TCP connections, preventing legitimate players from joining.</li>
                  <li><strong>IP Exposure:</strong> If misconfigured, your real server IP leaks through DNS, server list metadata, or direct connection attempts, allowing attackers to bypass any proxy.</li>
                  <li><strong>Resource Exhaustion:</strong> Malicious requests to non-existent paths (<code>/wp-login.php</code>, <code>/.env</code>) consume CPU and memory, degrading server performance.</li>
                </ul>
                <div className="bg-red-800/20 p-3 rounded mt-4">
                  <p className="text-sm text-red-200">
                    <strong>Reality Check:</strong> Even with <code>sv_requestParanoia 3</code>, FiveM's built-in protections are reactive and limited.
                    By the time FXServer detects abuse, hundreds of malicious requests have already hit your server.<br />
                    <strong>You need upstream filtering to stop attacks before they reach FXServer.</strong>
                  </p>
                </div>
              </div>

              {/* The Solution */}
              <div className="bg-blue-900/10 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8">
                <h3 className="text-xl font-bold text-blue-400 mb-3">The "Blast Shield" Solution: NGINX Reverse Proxy Architecture</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                  Deploy a <strong>Linux NGINX proxy</strong> as an upstream filter in front of your Windows FiveM server.
                  This creates a <strong>defense-in-depth architecture</strong> where NGINX handles Layer 7 filtering, rate limiting, and connection management<br />
                  <em>before</em> traffic reaches FXServer. Think of it as a dedicated firewall + load balancer + traffic analyzer combined.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-800/50 p-4 rounded border border-slate-700">
                    <div className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" /> Layer 7 (HTTP) Filtering
                    </div>
                    <p className="text-xs text-slate-400">
                      Inspect HTTP headers, User-Agents, request paths, query strings. Use <code>map</code> directives to blacklist/whitelist patterns.
                      Block scrapers, bots, and exploit attempts (<code>/wp-admin</code>, <code>/.env</code>) at the proxy level.
                      <strong className="text-blue-300"> Attacker requests never reach FXServer.</strong>
                    </p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded border border-slate-700">
                    <div className="text-purple-400 font-bold mb-2 flex items-center gap-2">
                      <Zap className="w-4 h-4" /> Token Bucket Rate Limiting
                    </div>
                    <p className="text-xs text-slate-400">
                      Use <code>limit_req_zone</code> with burst buffers to enforce per-IP limits. Example: 5 req/s for <code>/info.json</code>, 10 req/s globally.
                      Legitimate players generate ~2-3 req/s. Attackers trying 100+ req/s hit the limit instantly and get <code>503 Service Unavailable</code>.
                    </p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded border border-slate-700">
                    <div className="text-green-400 font-bold mb-2 flex items-center gap-2">
                      <Lock className="w-4 h-4" /> IP Obfuscation via Proxy
                    </div>
                    <p className="text-xs text-slate-400">
                      Players connect to the proxy's public IP only. Your Windows server IP is never exposed in server lists or DNS records.
                      Even if attackers scan adjacent IPs near your proxy, they won't know which IP (if any) hosts the actual game server. <strong>The proxy acts as the single point of contact.</strong>
                    </p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded border border-slate-700">
                    <div className="text-amber-400 font-bold mb-2 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" /> Real-Time Monitoring & Auto-Ban
                    </div>
                    <p className="text-xs text-slate-400">
                      A Node.js "Watcher" tails NGINX access logs, detects attack patterns (e.g., {'>'}100 requests with {'>'}70% blocked), and auto-bans via <code>iptables</code>.
                      Exposes JSON API for building dashboards with <strong>live RPS graphs, IP history, ban lists, and alert feeds</strong>.
                    </p>
                  </div>
                </div>
                <div className="bg-blue-800/20 p-4 rounded">
                  <h4 className="font-bold text-white mb-2">How This Stops Attacks:</h4>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• <strong>HTTP Floods:</strong> Rate limiter drops excess requests. Attacker sees 503 errors, FXServer stays responsive.</li>
                    <li>• <strong>UDP Floods:</strong> NGINX <code>stream</code> module proxies UDP with connection tracking. Malicious IPs get banned by watcher.</li>
                    <li>• <strong>SYN Floods:</strong> Linux kernel handles TCP better than Windows. NGINX absorbs SYN floods with <code>tcp_syncookies</code>.</li>
                    <li>• <strong>IP Obfuscation:</strong> Only the proxy IP is advertised. Attackers can't discover your game server's IP since it's never exposed in DNS, server lists, or direct connections.</li>
                  </ul>
                </div>
                <p className="text-sm text-slate-400 italic mt-4">
                  <strong>Result:</strong> A "clean pipe" architecture where only valid, rate-limited traffic reaches FXServer.
                  Your server crashes less, runs faster, and can handle larger player counts without performance degradation.
                </p>
              </div>

              {/* Key Benefits */}
              <div className="bg-slate-800/30 p-6 rounded-lg">
                <h4 className="font-bold text-white mb-3">Key Benefits of This Architecture</h4>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <strong>Reduces FiveM Server Load:</strong> FXServer no longer handles malicious requests. `sv_requestParanoia` becomes a fallback, not the primary defense.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <strong>Hides Server IP:</strong> Only the proxy IP is publicly advertised. Your game server's IP remains unknown to attackers since it's never listed in server browsers or DNS records.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <strong>Scalable:</strong> Want to add another game server? Just add it to the NGINX `upstream` block. The proxy distributes traffic.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <strong>Observable:</strong> Centralized logs make it easy to analyze attacks, build graphs, and improve your filtering rules over time.
                    </div>
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>

        {/* Seperator */}
        <div className="my-12 flex items-center justify-center" aria-hidden>
          <div className="w-full max-w-4xl flex items-center gap-4">
            <div className="flex-1 h-px bg-linear-to-r from-transparent via-slate-700/50 to-transparent" />
            <span className="text-xs text-slate-400 uppercase tracking-wider px-3">Interactive Demo</span>
            <div className="flex-1 h-px bg-linear-to-r from-transparent via-slate-700/50 to-transparent" />
          </div>
        </div>

        {/* Interactive Dashboard */}
        <section id="simulation" className="mb-12 mt-12 scroll-mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Interactive Filter Simulation</h2>
              <p className="text-slate-400 text-sm mt-1">
                Visualize how the filter handles traffic. Simulate attacks, manage whitelists, and see the "Watcher" logic in action.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20 animate-pulse">
              LIVE ENVIRONMENT
            </span>
          </div>
          <SimulationDashboard />
        </section>

        {/* Seperator */}
        <div className="my-12 flex items-center justify-center" aria-hidden>
          <div className="w-full max-w-4xl flex items-center gap-4">
            <div className="flex-1 h-px bg-linear-to-r from-transparent via-slate-700/50 to-transparent" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-16 text-slate-300">
            {/* ========================================
          SECTION 2: PREREQUISITES & ARCHITECTURE
      ======================================== */}
            <section id="prerequisites" className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-600 text-white font-bold w-10 h-10 flex items-center justify-center rounded-full text-lg">1</div>
                <h2 className="text-3xl font-bold text-white">Prerequisites & Network Topology</h2>
              </div>

              {/* What You Need */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">What You Need</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700">
                    <h4 className="font-bold text-blue-400 mb-2 flex items-center gap-2"><Server className="w-4 h-4" /> Linux Proxy Server</h4>
                    <ul className="text-sm text-slate-400 space-y-1">
                      <li>• <strong>OS:</strong> Ubuntu 22.04 LTS (recommended)</li>
                      <li>• <strong>CPU:</strong> 2+ cores</li>
                      <li>• <strong>RAM:</strong> 2GB minimum</li>
                      <li>• <strong>Network:</strong> 1 Gbps port</li>
                      <li>• <strong>Public IP:</strong> Required (this is the IP players connect to)</li>
                    </ul>
                  </div>
                  <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700">
                    <h4 className="font-bold text-purple-400 mb-2 flex items-center gap-2"><Monitor className="w-4 h-4" /> Windows Game Server</h4>
                    <ul className="text-sm text-slate-400 space-y-1">
                      <li>• <strong>OS:</strong> Windows Server 2019/2022</li>
                      <li>• <strong>FiveM:</strong> Latest artifacts</li>
                      <li>• <strong>Private IP:</strong> 10.0.0.2 (or similar)</li>
                      <li>• <strong>Firewall:</strong> Only allow 10.0.0.1 (the proxy)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Network Diagram */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Network Topology</h3>
                <div className="bg-black p-6 rounded-lg border border-slate-800 font-mono text-xs overflow-x-auto">
                  <pre className="text-slate-300">{`
┌──────────────────┐
│                  │
│    INTERNET      │  ← Players connect here
│                  │
└────────┬─────────┘
         │
         │ Public IP (e.g., 1.2.3.4)
         ▼
┌─────────────────────────────────────────────┐
│  LINUX PROXY (NGINX)                        │
│  • Public IP: 1.2.3.4                       │
│  • Private IP: 10.0.0.1                     │
│  • Role: Filter, Rate-Limit, Proxy         │
│  • Software: NGINX + Node.js Watcher        │
└────────┬────────────────────────────────────┘
         │
         │ Private Subnet (10.0.0.0/24)
         │ 10.0.0.0/24
         ▼
┌─────────────────────────────────────────────┐
│  WINDOWS GAME SERVER (FiveM)                │
│  • Private IP: 10.0.0.2                     │
│  • Firewall: ONLY accepts 10.0.0.1          │
│  • Role: Run FXServer                       │
│  • Ports: 30120 (TCP/UDP)                   │
└─────────────────────────────────────────────┘
            `}</pre>
                </div>
                <div className="bg-amber-900/10 border border-amber-500/30 p-4 rounded-lg mt-4">
                  <h4 className="font-bold text-amber-400 mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Critical: Don't Use Adjacent Public IPs</h4>
                  <p className="text-sm text-slate-400">
                    <strong>Do NOT</strong> use consecutive public IPs for both servers. If your proxy is <code>1.2.3.4</code>,
                    don't make your game server <code>1.2.3.5</code> – attackers will scan adjacent IPs and find it.
                    <strong>Best practice:</strong> Use a completely different IP range for your game server, or use private IPs (10.x.x.x) if both servers are in the same datacenter.
                    Most providers offer private networking (OVH vRack, Hetzner Cloud Networks, AWS VPC) where servers communicate via internal IPs.
                  </p>
                </div>
              </div>

              {/* How Many IPs? */}
              <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
                <h4 className="font-bold text-white mb-3">How Many IPs Do I Need?</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><strong className="text-white">1 Public IP:</strong> For the Linux proxy (this is what goes in your FiveM server list)</li>
                  <li><strong className="text-white">2 Private IPs:</strong> One for the proxy's internal interface (10.0.0.1), one for the Windows server (10.0.0.2)</li>
                  <li className="text-slate-500 italic">You do <strong>not</strong> need a public IP for the Windows server. In fact, it's better if it doesn't have one.</li>
                </ul>
              </div>
            </section>

            {/* ========================================
          SECTION 3: INSTALLATION
      ======================================== */}
            <section id="installation" className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-600 text-white font-bold w-10 h-10 flex items-center justify-center rounded-full text-lg">2</div>
                <h2 className="text-3xl font-bold text-white">Installation (Linux Proxy)</h2>
              </div>

              <p className="text-slate-400 mb-6">
                SSH into your Linux proxy server and run these commands:
              </p>

              <CodeBlock
                title="Terminal - Initial Setup"
                code={`# Update system packages
sudo apt update && sudo apt upgrade -y

# Install NGINX (full version with stream module)
sudo apt install nginx-full -y

# Install Node.js (for the watcher script)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y

# Verify installations
nginx -v
node -v

# Install UFW firewall
sudo apt install ufw -y

# Configure firewall rules
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS (for SSL later)
sudo ufw allow 30120/tcp   # FiveM HTTP
sudo ufw allow 30120/udp   # FiveM UDP
sudo ufw enable

# Start NGINX
sudo systemctl enable nginx
sudo systemctl start nginx`}
              />

              <div className="bg-blue-900/10 border border-blue-500/30 p-4 rounded-lg mt-6">
                <p className="text-sm text-blue-300">
                  <strong className="flex items-center gap-1"><CheckCircle className="w-3 h-3 inline" /> Checkpoint:</strong> Visit <code>http://YOUR_PUBLIC_IP</code> in a browser.
                  You should see the default NGINX welcome page.
                </p>
              </div>
            </section>

            {/* ========================================
          SECTION 4: NGINX HTTP CONFIGURATION
      ======================================== */}
            <section id="nginx-config" className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-600 text-white font-bold w-10 h-10 flex items-center justify-center rounded-full text-lg">3</div>
                <h2 className="text-3xl font-bold text-white">NGINX HTTP Filter Configuration</h2>
              </div>

              <p className="text-slate-400 mb-4">
                This is the core logic. Save this to <code className="text-blue-400">/etc/nginx/conf.d/fivem_filter.conf</code>
              </p>

              <CodeBlock
                title="/etc/nginx/conf.d/fivem_filter.conf"
                code={`# FiveM HTTP Filter Configuration
# Protects /info.json, /players.json, and other HTTP endpoints

# ============================================
# 1. User-Agent Blacklist
# ============================================
# Block known bot/scanner User-Agents
map $http_user_agent $bad_client {
    default 0;
    
    # Common attack tools
    "~*python" 1;
    "~*curl" 1;
    "~*wget" 1;
    "~*go-http-client" 1;
    "~*libwww-perl" 1;
    "~*httpclient" 1;
    "~*scanner" 1;
    "~*bot" 1;
    
    # Empty User-Agent (red flag)
    "" 1;
}

# ============================================
# 2. Rate Limiting Zones
# ============================================
# Limit per IP address
limit_req_zone $binary_remote_addr zone=fivem_global:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=fivem_api:10m rate=5r/s;

# Limit concurrent connections per IP
limit_conn_zone $binary_remote_addr zone=fivem_conn:10m;

# ============================================
# 3. Upstream (Your Windows Server)
# ============================================
upstream fivem_backend {
    server 10.0.0.2:30120;  # Windows Private IP
    keepalive 32;
}

# ============================================
# 4. HTTP Server Block
# ============================================
server {
    listen 80;
    listen [::]:80;
    server_name play.yourserver.com;  # Replace with your domain or use _ for catch-all

    # Block bad User-Agents globally
    if ($bad_client) {
        return 444;  # Close connection without response
    }

    # Logging (essential for the Watcher)
    access_log /var/log/nginx/fivem_access.log combined;
    error_log /var/log/nginx/fivem_error.log warn;

    # ============================================
    # Default Location (all traffic)
    # ============================================
    location / {
        # Apply rate limits
        limit_req zone=fivem_global burst=20 nodelay;
        limit_conn fivem_conn 15;

        # Proxy to backend
        proxy_pass http://fivem_backend;
        proxy_http_version 1.1;
        
        # Preserve client info
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header Connection "";
        
        # Timeouts
        proxy_connect_timeout 10s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }

    # ============================================
    # Strict Rate-Limit for API Endpoints
    # ============================================
    location ~ ^/(info\\.json|players\\.json|dynamic\\.json) {
        limit_req zone=fivem_api burst=3 nodelay;
        limit_conn fivem_conn 5;
        
        proxy_pass http://fivem_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr;
    }

    # ============================================
    # Block Malicious Paths
    # ============================================
    location ~ /(wp-admin|wp-login|phpMyAdmin|\\.env|\\.git) {
        access_log /var/log/nginx/fivem_blocked.log combined;
        return 403;
    }
}`}
              />

              <div className="mt-6 space-y-4">
                <div className="bg-slate-800/50 p-4 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-bold text-white mb-2">Understanding Rate Limits</h4>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>• <code>rate=10r/s</code> means 10 requests per second per IP</li>
                    <li>• <code>burst=20</code> allows temporary spikes (like a player refreshing)</li>
                    <li>• <code>nodelay</code> rejects excess requests immediately instead of queuing</li>
                  </ul>
                </div>
                <div className="bg-amber-900/10 border border-amber-500/30 p-4 rounded-lg">
                  <h4 className="font-bold text-amber-400 mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Testing Tip</h4>
                  <p className="text-sm text-slate-400">
                    After creating this file, test the config with: <code className="text-white">sudo nginx -t</code>
                    <br />Then reload: <code className="text-white">sudo systemctl reload nginx</code>
                  </p>
                </div>
              </div>
            </section>

            {/* ========================================
          SECTION 5: NGINX UDP STREAM PROXY
      ======================================== */}
            <section id="udp-proxy" className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-600 text-white font-bold w-10 h-10 flex items-center justify-center rounded-full text-lg">4</div>
                <h2 className="text-3xl font-bold text-white">UDP Stream Proxy (Game Traffic)</h2>
              </div>

              <p className="text-slate-400 mb-4">
                FiveM uses <strong>UDP</strong> for actual gameplay. You must proxy this as well.
                Add this to <code className="text-blue-400">/etc/nginx/nginx.conf</code> (at the <strong>top level</strong>, outside the <code>http</code> block):
              </p>

              <CodeBlock
                title="/etc/nginx/nginx.conf (append to the end)"
                code={`# Add this OUTSIDE the http {} block (at the top level)

stream {
    # Logging for UDP traffic
    log_format basic '$remote_addr [$time_local] $protocol $status $bytes_sent $bytes_received $session_time';
    access_log /var/log/nginx/stream_access.log basic;
    error_log /var/log/nginx/stream_error.log;

    # Upstream for game server
    upstream fivem_udp_backend {
        server 10.0.0.2:30120;
    }

    # TCP Proxy (for initial connection handshakes)
    server {
        listen 30120;
        proxy_pass fivem_udp_backend;
        proxy_timeout 60s;
        proxy_connect_timeout 10s;
    }

    # UDP Proxy (the main game traffic)
    server {
        listen 30120 udp reuseport;
        proxy_pass fivem_udp_backend;
        proxy_timeout 60s;
        proxy_responses 1;
    }
}`}
              />

              <div className="bg-green-900/10 border border-green-500/30 p-4 rounded-lg mt-6">
                <h4 className="font-bold text-green-400 mb-2 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Why Both TCP and UDP?</h4>
                <p className="text-sm text-slate-400">
                  FiveM uses <strong>TCP for initial connection negotiation</strong> and <strong>UDP for game data</strong>.
                  You need both proxy blocks to ensure players can connect and play.
                </p>
              </div>

              <div className="mt-4">
                <CodeBlock
                  title="Verify & Reload NGINX"
                  code={`# Test configuration
sudo nginx -t

# If OK, reload
sudo systemctl reload nginx

# Check if NGINX is listening on 30120
sudo netstat -tulpn | grep 30120`}
                />
              </div>
            </section>

            {/* ========================================
          SECTION 6: WINDOWS SERVER CONFIGURATION
      ======================================== */}
            <section id="server-config" className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-600 text-white font-bold w-10 h-10 flex items-center justify-center rounded-full text-lg">5</div>
                <h2 className="text-3xl font-bold text-white">Windows FiveM Server Configuration</h2>
              </div>

              <p className="text-slate-400 mb-4">
                Configure your <code>server.cfg</code> to work with the proxy:
              </p>

              <CodeBlock
                title="server.cfg"
                code={`# ============================================
# Proxy Configuration
# ============================================
# Tell FiveM to trust the proxy
set sv_proxyIPRanges "10.0.0.1/32"

# Bind to the PRIVATE IP (not 0.0.0.0)
set sv_endpoints "10.0.0.2:30120"

# Use the PUBLIC proxy domain for server listing
set sv_forceIndirectListing true
set sv_listingHostOverride "play.yourserver.com"  # Your proxy's domain/IP

# Hide internal IPs from server info responses
set sv_endpointprivacy true

# ============================================
# Security Hardening
# ============================================
set sv_requestParanoia 3       # Reject unusual HTTP patterns
set sv_authMinTrust 4          # Require account age for join
set sv_authMaxVariance 5       # Limit IP variance for same account
set sv_filterRequestControl 4  # Block rapid request changes

# ============================================
# Performance
# ============================================
set sv_maxclients 48
set onesync on`}
              />

              <div className="mt-6 bg-slate-800/50 p-5 rounded-lg border border-slate-700">
                <h4 className="font-bold text-white mb-3">Windows Firewall Rules (Optional but Recommended)</h4>
                <p className="text-sm text-slate-400 mb-3">
                  On your Windows server, restrict <strong>port 30120</strong> to only accept connections from the proxy IP (10.0.0.1). 
                  This doesn't affect other services - Windows can still access the internet, receive RDP connections, etc.
                </p>
                <CodeBlock
                  title="PowerShell (Run as Administrator)"
                  code={`# Block external traffic on FiveM port 30120 (TCP/UDP)
New-NetFirewallRule -DisplayName "FiveM - Block Public" \`
  -Direction Inbound -LocalPort 30120 -Protocol TCP -Action Block

New-NetFirewallRule -DisplayName "FiveM - Block Public UDP" \`
  -Direction Inbound -LocalPort 30120 -Protocol UDP -Action Block

# Allow ONLY from the proxy's private IP (10.0.0.1)
New-NetFirewallRule -DisplayName "FiveM - Allow Proxy" \`
  -Direction Inbound -LocalPort 30120 -Protocol TCP \`
  -RemoteAddress 10.0.0.1 -Action Allow

New-NetFirewallRule -DisplayName "FiveM - Allow Proxy UDP" \`
  -Direction Inbound -LocalPort 30120 -Protocol UDP \`
  -RemoteAddress 10.0.0.1 -Action Allow`}
                />
                <p className="text-xs text-slate-500 mt-3">
                  ⚠️ These rules only affect port 30120. All other ports (RDP 3389, HTTP 80, etc.) remain unaffected.
                </p>
              </div>

              <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded">
                <p className="text-sm text-blue-300">
                  <strong>📖 Official Reference:</strong> For more details on proxy setup, see the{' '}
                  <a
                    href="https://docs.fivem.net/docs/server-manual/proxy-setup/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-white font-bold"
                  >
                    FiveM Proxy Setup Documentation
                  </a>.
                </p>
              </div>
            </section>

            {/* ========================================
          SECTION 7: NODE.JS WATCHER SYSTEM
      ======================================== */}
            <section id="watcher-service" className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-600 text-white font-bold w-10 h-10 flex items-center justify-center rounded-full text-lg">6</div>
                <h2 className="text-3xl font-bold text-white">Real-Time Watcher & Auto-Ban System</h2>
              </div>

              <p className="text-slate-400 mb-6">
                This Node.js script monitors NGINX logs in real-time, detects attacks, and automatically bans malicious IPs.
                It also exposes a <strong>JSON API</strong> for building dashboards (like the demo above).
              </p>

              <div className="space-y-6">
                {/* Setup */}
                <div>
                  <h4 className="text-lg font-bold text-white mb-3">Setup</h4>
                  <CodeBlock
                    title="Terminal"
                    code={`# Create project directory
sudo mkdir -p /opt/fivem-watcher
cd /opt/fivem-watcher

# Initialize Node.js project
sudo npm init -y

# Install dependencies
sudo npm install tail express`}
                  />
                </div>

                {/* Watcher Script */}
                <div>
                  <h4 className="text-lg font-bold text-white mb-3">Watcher Script</h4>
                  <CodeBlock
                    title="/opt/fivem-watcher/watcher.js"
                    code={`const Tail = require('tail').Tail;
const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
const LOG_FILE = '/var/log/nginx/fivem_access.log';
const BANNED_IPS_FILE = '/opt/fivem-watcher/banned_ips.json';

// Stats storage
let stats = {
    totalRequests: 0,
    blockedRequests: 0,
    allowedRequests: 0,
    rps: 0,
    lastReset: Date.now(),
    topIps: {},
    recentEvents: []
};

// Load banned IPs from disk
let bannedIps = [];
try {
    bannedIps = JSON.parse(fs.readFileSync(BANNED_IPS_FILE, 'utf8'));
} catch (e) {
    bannedIps = [];
}

// Save banned IPs to disk
function saveBannedIps() {
    fs.writeFileSync(BANNED_IPS_FILE, JSON.stringify(bannedIps, null, 2));
}

// Reset RPS counter every second
setInterval(() => {
    stats.rps = 0;
}, 1000);

// Tail the log file
const tail = new Tail(LOG_FILE, {
    fromBeginning: false,
    follow: true,
    useWatchFile: true
});

tail.on("line", (data) => {
    stats.totalRequests++;
    stats.rps++;

    // Parse log line (NGINX combined format)
    // Example: 192.168.1.1 - - [25/Nov/2025:12:00:00 +0000] "GET /info.json HTTP/1.1" 200 ...
    const parts = data.split(' ');
    const ip = parts[0];
    const statusCode = parseInt(parts[8]) || 0;
    const path = parts[6] || '';
    const userAgent = data.match(/"([^"]*)"\\s*$/)?.[1] || '';

    // Track IP
    if (!stats.topIps[ip]) {
        stats.topIps[ip] = { count: 0, blocked: 0 };
    }
    stats.topIps[ip].count++;

    // Detect blocked requests
    const isBlocked = statusCode === 403 || statusCode === 444 || statusCode >= 500;
    if (isBlocked) {
        stats.blockedRequests++;
        stats.topIps[ip].blocked++;
    } else {
        stats.allowedRequests++;
    }

    // Add to recent events (keep last 100)
    stats.recentEvents.unshift({
        ts: Date.now(),
        ip,
        path,
        status: statusCode,
        ua: userAgent
    });
    if (stats.recentEvents.length > 100) stats.recentEvents.pop();

    // Auto-ban logic: If an IP has >100 requests and >70% blocked, ban it
    const ipStats = stats.topIps[ip];
    if (ipStats.count > 100 && (ipStats.blocked / ipStats.count) > 0.7) {
        if (!bannedIps.includes(ip)) {
            console.log(\`[AUTO-BAN] \${ip} - \${ipStats.blocked}/\${ipStats.count} blocked\`);
            
            // Ban via iptables
            exec(\`iptables -I INPUT -s \${ip} -j DROP\`, (err) => {
                if (err) {
                    console.error(\`Failed to ban \${ip}:\`, err.message);
                } else {
                    bannedIps.push(ip);
                    saveBannedIps();
                }
            });
        }
    }
});

tail.on("error", (error) => {
    console.error('Tail error:', error);
});

// API Endpoints
app.get('/stats', (req, res) => {
    res.json(stats);
});

app.get('/banned', (req, res) => {
    res.json({ bannedIps });
});

app.post('/ban/:ip', (req, res) => {
    const ip = req.params.ip;
    if (bannedIps.includes(ip)) {
        return res.json({ success: false, message: 'Already banned' });
    }
    
    exec(\`iptables -I INPUT -s \${ip} -j DROP\`, (err) => {
        if (err) {
            res.status(500).json({ success: false, error: err.message });
        } else {
            bannedIps.push(ip);
            saveBannedIps();
            res.json({ success: true, message: \`Banned \${ip}\` });
        }
    });
});

app.post('/unban/:ip', (req, res) => {
    const ip = req.params.ip;
    exec(\`iptables -D INPUT -s \${ip} -j DROP\`, (err) => {
        if (err) {
            res.status(500).json({ success: false, error: err.message });
        } else {
            bannedIps = bannedIps.filter(x => x !== ip);
            saveBannedIps();
            res.json({ success: true, message: \`Unbanned \${ip}\` });
        }
    });
});

// Start API server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(\`[WATCHER] Monitoring \${LOG_FILE}\`);
    console.log(\`[API] Running on http://localhost:\${PORT}\`);
    console.log(\`[API] Endpoints: /stats, /banned, /ban/:ip, /unban/:ip\`);
});`}
                  />
                </div>

                {/* Systemd Service */}
                <div>
                  <h4 className="text-lg font-bold text-white mb-3">Run as a Service</h4>
                  <CodeBlock
                    title="/etc/systemd/system/fivem-watcher.service"
                    code={`[Unit]
Description=FiveM NGINX Watcher
After=network.target nginx.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/fivem-watcher
ExecStart=/usr/bin/node /opt/fivem-watcher/watcher.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target`}
                  />
                  <CodeBlock
                    title="Terminal - Enable Service"
                    code={`# Reload systemd
sudo systemctl daemon-reload

# Enable and start
sudo systemctl enable fivem-watcher
sudo systemctl start fivem-watcher

# Check status
sudo systemctl status fivem-watcher

# View logs
sudo journalctl -u fivem-watcher -f`}
                  />
                </div>

                {/* API Usage */}
                <div className="bg-green-900/10 border border-green-500/30 p-5 rounded-lg">
                  <h4 className="font-bold text-green-400 mb-3 flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Using the API</h4>
                  <p className="text-sm text-slate-400 mb-3">
                    You can now query the watcher from any tool:
                  </p>
                  <CodeBlock
                    title="Examples"
                    code={`# Get current stats
curl http://YOUR_PROXY_IP:3000/stats

# Get banned IPs
curl http://YOUR_PROXY_IP:3000/banned

# Manually ban an IP
curl -X POST http://YOUR_PROXY_IP:3000/ban/192.168.1.100

# Unban an IP
curl -X POST http://YOUR_PROXY_IP:3000/unban/192.168.1.100`}
                  />
                </div>
              </div>
            </section>

            {/* ========================================
          SECTION 8: LOG PARSER & ANALYSIS
      ======================================== */}
            <section id="log-parser" className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-600 text-white font-bold w-10 h-10 flex items-center justify-center rounded-full text-lg">7</div>
                <h2 className="text-3xl font-bold text-white">Log Parser & Post-Attack Analysis</h2>
              </div>

              <p className="text-slate-400 mb-6">
                After an attack, you need to analyze the logs to understand what happened. This script generates a detailed report.
              </p>

              <CodeBlock
                title="/opt/fivem-watcher/analyze.sh"
                code={`#!/bin/bash
# FiveM Attack Analysis Script

LOG=/var/log/nginx/fivem_access.log
BLOCKED_LOG=/var/log/nginx/fivem_blocked.log

echo "========================================="
echo "  FiveM Attack Analysis Report"
echo "  Generated: $(date)"
echo "========================================="
echo ""

echo "--- TOP 20 ATTACKING IPs ---"
awk '{print $1}' $LOG | sort | uniq -c | sort -nr | head -n 20 | \
while read count ip; do
    printf "%s requests from %s\\n" "$count" "$ip"
done
echo ""

echo "--- TOP 10 User Agents ---"
awk -F'"' '{print $6}' $LOG | sort | uniq -c | sort -nr | head -n 10
echo ""

echo "--- HTTP Status Code Distribution ---"
awk '{print $9}' $LOG | grep -E '^[0-9]+$' | sort | uniq -c | sort -nr
echo ""

echo "--- Most Targeted Paths ---"
awk '{print $7}' $LOG | sort | uniq -c | sort -nr | head -n 15
echo ""

echo "--- Blocked Requests by Path ---"
if [ -f "$BLOCKED_LOG" ]; then
    awk '{print $7}' $BLOCKED_LOG | sort | uniq -c | sort -nr | head -n 10
else
    echo "(No blocked log found)"
fi
echo ""

echo "--- Requests Over Time (Last Hour) ---"
awk -v now="$(date +%s)" '{
    match($0, /\\[([^\\]]+)\\]/, arr);
    cmd = "date -d '" arr[1] "' +%s 2>/dev/null";
    cmd | getline ts;
    close(cmd);
    if (ts > now - 3600) print substr($0, 1, 20);
}' $LOG | cut -d: -f1-2 | uniq -c
echo ""

echo "========================================="
echo "  Report Complete"
echo "========================================="`}
              />

              <CodeBlock
                title="Make executable and run"
                code={`# Make executable
sudo chmod +x /opt/fivem-watcher/analyze.sh

# Run analysis
sudo /opt/fivem-watcher/analyze.sh

# Save to file
sudo /opt/fivem-watcher/analyze.sh > /tmp/attack_report_$(date +%Y%m%d_%H%M%S).txt`}
              />
            </section>

            {/* ========================================
          SECTION 9: BONUSES & ADVANCED
      ======================================== */}
            <section id="bonuses" className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-purple-600 text-white font-bold w-10 h-10 flex items-center justify-center rounded-full text-lg">+</div>
                <h2 className="text-3xl font-bold text-white">Bonus: Advanced Techniques</h2>
              </div>

              <div className="space-y-8">

                {/* SSL/TLS */}
                <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <span>🔐</span> Add SSL/TLS (HTTPS)
                  </h3>
                  <p className="text-sm text-slate-400 mb-3">
                    Use Let's Encrypt to secure your HTTP endpoints:
                  </p>
                  <CodeBlock
                    title="Terminal"
                    code={`# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate (replace with your domain)
sudo certbot --nginx -d play.yourserver.com

# Certbot will auto-configure NGINX. Verify:
sudo nginx -t && sudo systemctl reload nginx`}
                  />
                </div>

                {/* GeoIP Blocking */}
                <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <span>🌍</span> GeoIP Blocking
                  </h3>
                  <p className="text-sm text-slate-400 mb-3">
                    Block entire countries if you're being attacked from specific regions:
                  </p>
                  <CodeBlock
                    title="Install GeoIP Module"
                    code={`sudo apt install libnginx-mod-http-geoip -y
sudo mkdir -p /usr/share/GeoIP
cd /usr/share/GeoIP
sudo wget https://dl.miyuru.lk/geoip/maxmind/country/maxmind.dat.gz
sudo gunzip maxmind.dat.gz
sudo mv maxmind.dat GeoIP.dat`}
                  />
                  <CodeBlock
                    title="Add to nginx.conf (in http block)"
                    code={`http {
    geoip_country /usr/share/GeoIP/GeoIP.dat;
    
    # Block specific countries (use ISO codes)
    map $geoip_country_code $blocked_country {
        default 0;
        CN 1;  # China
        RU 1;  # Russia
        # Add more as needed
    }
    
    # Then in your server block:
    # if ($blocked_country) { return 403; }
}`}
                  />
                </div>

                {/* Dashboard */}
                <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <span>📈</span> Build a Real Dashboard with Graphs
                  </h3>
                  <p className="text-sm text-slate-400 mb-4">
                    The watcher API returns JSON. Here's how to build a professional admin dashboard with real-time graphs:
                  </p>

                  <div className="bg-black/30 p-4 rounded mb-4">
                    <h4 className="text-sm font-bold text-white mb-2">Example: Real-Time RPS Graph</h4>
                    <CodeBlock
                      title="dashboard.html"
                      code={`<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <canvas id="rpsChart" width="400" height="200"></canvas>
    <script>
        const ctx = document.getElementById('rpsChart').getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Requests/Second',
                    data: [],
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: { y: { beginAtZero: true } },
                animation: { duration: 0 }
            }
        });

        // Poll API every second
        setInterval(async () => {
            const res = await fetch('http://YOUR_PROXY_IP:3000/stats');
            const stats = await res.json();
            
            // Add new data point
            chart.data.labels.push(new Date().toLocaleTimeString());
            chart.data.datasets[0].data.push(stats.rps);
            
            // Keep only last 30 points
            if (chart.data.labels.length > 30) {
                chart.data.labels.shift();
                chart.data.datasets[0].data.shift();
            }
            
            chart.update();
        }, 1000);
    </script>
</body>
</html>`}
                    />
                  </div>

                  <div className="bg-black/30 p-4 rounded mb-4">
                    <h4 className="text-sm font-bold text-white mb-2">Example: Top Attacking IPs Table</h4>
                    <CodeBlock
                      title="ip-table.js"
                      code={`async function updateIPTable() {
    const res = await fetch('http://YOUR_PROXY_IP:3000/stats');
    const stats = await res.json();
    
    // Sort IPs by request count
    const topIPs = Object.entries(stats.topIps)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 10);
    
    const table = document.getElementById('ipTable');
    table.innerHTML = topIPs.map(([ip, data]) => \`
        <tr class="\${data.blocked > data.count * 0.5 ? 'bg-red-900/20' : ''}">
            <td>\${ip}</td>
            <td>\${data.count}</td>
            <td>\${data.blocked}</td>
            <td>
                <button onclick="banIP('\${ip}')" 
                    class="bg-red-600 px-2 py-1 rounded text-xs">
                    BAN
                </button>
            </td>
        </tr>
    \`).join('');
}

async function banIP(ip) {
    await fetch(\`http://YOUR_PROXY_IP:3000/ban/\${ip}\`, { method: 'POST' });
    alert(\`Banned \${ip}\`);
    updateIPTable();
}

setInterval(updateIPTable, 2000);`}
                    />
                  </div>

                  <div className="bg-black/30 p-4 rounded">
                    <h4 className="text-sm font-bold text-white mb-2">Example: Status Code Pie Chart</h4>
                    <CodeBlock
                      title="status-chart.js"
                      code={`const statusCtx = document.getElementById('statusChart').getContext('2d');
const statusChart = new Chart(statusCtx, {
    type: 'doughnut',
    data: {
        labels: ['200 OK', '403 Forbidden', '444 Blocked', '5xx Errors'],
        datasets: [{
            data: [0, 0, 0, 0],
            backgroundColor: [
                'rgb(34, 197, 94)',
                'rgb(251, 191, 36)',
                'rgb(239, 68, 68)',
                'rgb(168, 85, 247)'
            ]
        }]
    }
});

setInterval(async () => {
    const res = await fetch('http://YOUR_PROXY_IP:3000/stats');
    const stats = await res.json();
    
    // Parse recent events for status codes
    const codes = { '200': 0, '403': 0, '444': 0, '5xx': 0 };
    stats.recentEvents.forEach(e => {
        if (e.status === 200) codes['200']++;
        else if (e.status === 403) codes['403']++;
        else if (e.status === 444) codes['444']++;
        else if (e.status >= 500) codes['5xx']++;
    });
    
    statusChart.data.datasets[0].data = [codes['200'], codes['403'], codes['444'], codes['5xx']];
    statusChart.update();
}, 3000);`}
                    />
                  </div>

                  <p className="text-sm text-slate-500 mt-4 italic">
                    The interactive simulation at the top of this page demonstrates these concepts.
                    Deploy your own dashboard using these examples and monitor your server in real-time!
                  </p>
                </div>

                {/* Whitelist Mode */}
                <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <span>✅</span> Whitelist Mode
                  </h3>
                  <p className="text-sm text-slate-400 mb-3">
                    During severe attacks, switch to "whitelist only" mode:
                  </p>
                  <CodeBlock
                    title="Add to nginx config"
                    code={`# Create whitelist map
geo $whitelist {
    default 0;
    10.0.0.0/24 1;     # Private network
    1.2.3.4 1;         # Your personal IP
    # Add trusted IPs here
}

# In server block:
if ($whitelist = 0) {
    return 403;
}`}
                  />
                </div>

                {/* Load Balancing */}
                <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <span>⚖️</span> Load Balancing (Multiple Game Servers)
                  </h3>
                  <p className="text-sm text-slate-400 mb-3">
                    Scale horizontally by adding more game servers:
                  </p>
                  <CodeBlock
                    title="Update upstream block"
                    code={`upstream fivem_backend {
    least_conn;  # Load balancing method
    server 10.0.0.2:30120 max_fails=3 fail_timeout=30s;
    server 10.0.0.3:30120 max_fails=3 fail_timeout=30s;
    server 10.0.0.4:30120 max_fails=3 fail_timeout=30s;
}`}
                  />
                </div>

              </div>
            </section>

            {/* ========================================
          SECTION 10: TROUBLESHOOTING
      ======================================== */}
            <section id="troubleshooting" className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-red-600 text-white font-bold w-10 h-10 flex items-center justify-center rounded-full text-lg">!</div>
                <h2 className="text-3xl font-bold text-white">Troubleshooting</h2>
              </div>

              <div className="space-y-4">
                <details className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <summary className="font-bold text-white cursor-pointer">Players can't connect</summary>
                  <div className="mt-3 text-sm text-slate-400 space-y-2">
                    <p>1. Check if NGINX is running: <code>sudo systemctl status nginx</code></p>
                    <p>2. Verify ports are open: <code>sudo netstat -tulpn | grep 30120</code></p>
                    <p>3. Check firewall: <code>sudo ufw status</code></p>
                    <p>4. Test UDP: <code>nc -u -v YOUR_IP 30120</code></p>
                    <p>5. Check NGINX error log: <code>sudo tail -f /var/log/nginx/error.log</code></p>
                  </div>
                </details>

                <details className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <summary className="font-bold text-white cursor-pointer">Server shows "Could not resolve endpoint" errors</summary>
                  <div className="mt-3 text-sm text-slate-400 space-y-2">
                    <p>This means your Windows server can't reach the proxy. Check:</p>
                    <p>1. Private network connectivity: <code>ping 10.0.0.1</code> from Windows</p>
                    <p>2. Firewall rules on Windows (must allow 10.0.0.1)</p>
                    <p>3. NGINX upstream IP is correct (10.0.0.2 should match Windows private IP)</p>
                  </div>
                </details>

                <details className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <summary className="font-bold text-white cursor-pointer">Watcher not banning IPs</summary>
                  <div className="mt-3 text-sm text-slate-400 space-y-2">
                    <p>1. Check if watcher is running: <code>sudo systemctl status fivem-watcher</code></p>
                    <p>2. Verify log file path: <code>ls -la /var/log/nginx/fivem_access.log</code></p>
                    <p>3. Check iptables permissions (watcher must run as root)</p>
                    <p>4. View watcher logs: <code>sudo journalctl -u fivem-watcher -n 50</code></p>
                  </div>
                </details>

                <details className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <summary className="font-bold text-white cursor-pointer">High latency after adding proxy</summary>
                  <div className="mt-3 text-sm text-slate-400 space-y-2">
                    <p>This is usually due to geographic distance or network congestion.</p>
                    <p>1. Use a proxy server <strong>close</strong> to your game server (same datacenter if possible)</p>
                    <p>2. Check if private network has low latency: <code>ping 10.0.0.2</code></p>
                    <p>3. Disable unnecessary NGINX modules/logging temporarily to test</p>
                  </div>
                </details>
              </div>
            </section>

            {/* ========================================
          FINAL NOTES
      ======================================== */}
            <section className="bg-linear-to-r from-blue-900/20 to-purple-900/20 p-8 rounded-xl border border-blue-500/30 mt-16">
              <h3 className="text-2xl font-bold text-white mb-4">🎯 You're Now Protected</h3>
              <p className="text-slate-300 mb-4">
                You've implemented a production-grade filtering system that will dramatically reduce attacks on your FiveM server.
                This setup is used by <strong>professional server hosts</strong> to keep their infrastructure online.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-slate-900/50 p-4 rounded">
                  <div className="font-bold text-green-400 mb-1 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Layer 7 Filtering</div>
                  <div className="text-slate-400">Block bad requests by content</div>
                </div>
                <div className="bg-slate-900/50 p-4 rounded">
                  <div className="font-bold text-blue-400 mb-1 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Auto-Ban System</div>
                  <div className="text-slate-400">Watcher handles attacks automatically</div>
                </div>
                <div className="bg-slate-900/50 p-4 rounded">
                  <div className="font-bold text-purple-400 mb-1 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Observable</div>
                  <div className="text-slate-400">Logs, APIs, and dashboards</div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-slate-400 text-sm">
                  Questions? Improvements? Feel free to adapt this guide to your needs.
                </p>
                <p className="text-blue-400 font-bold mt-2">Good luck, and stay online! 🚀</p>
              </div>
            </section>

          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900 py-12 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-slate-500 mb-4">
            &copy; {new Date().getFullYear()} FiveM Filter Kit by <strong>Burgil</strong>.
          </p>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            This project is for educational purposes. The author is not responsible for any downtime or data loss resulting from the use of these configurations.
          </p>
        </div>
      </footer>
    </div>
  );
}

