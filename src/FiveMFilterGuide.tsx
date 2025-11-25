import { SimulationDashboard } from './components/SimulationDashboard';
import { GuideContent } from './components/GuideContent';

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
                <span>⚡</span> Crash Prevention
              </div>
              <p className="text-xs text-slate-400">
                Stop HTTP floods, UDP packet storms, and SYN attacks <strong>before</strong> they reach FXServer.
                Your server stays responsive even under 10,000+ req/s attacks.
              </p>
            </div>
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
              <div className="text-purple-400 font-bold mb-2 flex items-center gap-2">
                <span>🎯</span> Smart Rate Limiting
              </div>
              <p className="text-xs text-slate-400">
                Token-bucket algorithm with configurable limits per second/minute/burst.
                Legitimate players never hit limits, attackers get <code>503</code> instantly.
              </p>
            </div>
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
              <div className="text-green-400 font-bold mb-2 flex items-center gap-2">
                <span>🔒</span> Auto-Ban & Whitelist
              </div>
              <p className="text-xs text-slate-400">
                Node.js watcher auto-bans IPs via <code>iptables</code> based on attack patterns.
                Whitelist trusted IPs, track request history per IP.
              </p>
            </div>
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
              <div className="text-amber-400 font-bold mb-2 flex items-center gap-2">
                <span>📊</span> Real-Time Monitoring
              </div>
              <p className="text-xs text-slate-400">
                Live RPS graphs, attack distribution charts, banned IP lists.
                See exactly who's hitting your server and what they're requesting.
              </p>
            </div>
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
              <div className="text-red-400 font-bold mb-2 flex items-center gap-2">
                <span>🚀</span> Layer 4 + Layer 7
              </div>
              <p className="text-xs text-slate-400">
                HTTP proxy <strong>and</strong> UDP stream proxy.
                Filter both web requests and game packets with a single NGINX instance.
              </p>
            </div>
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
              <div className="text-cyan-400 font-bold mb-2 flex items-center gap-2">
                <span>🎮</span> DDoS Simulation
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
          <div className="text-2xl">🛡️</div>
          <div>
            <h3 className="font-bold text-red-400">Security Disclaimer</h3>
            <p className="text-sm text-red-200/70 mt-1">
              This guide involves modifying core network configurations (NGINX, Firewall).
              Incorrect application can lock you out of your server.<br />
              <strong>Always test in a staging environment first.</strong> Use at your own risk.
            </p>
          </div>
        </div>

        {/* Interactive Dashboard */}
        <section id="simulation" className="mb-24 scroll-mt-24">
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

        {/* Main Guide Content */}
        <div className="max-w-4xl mx-auto">
          <GuideContent />
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
