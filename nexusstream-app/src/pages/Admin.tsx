import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'motion/react';
import { Terminal, Shield, Activity, Database, AlertCircle, Clock, Info, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/Authcontext';
import { useNavigate } from 'react-router-dom';

interface Log {
  id: number;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'SYSTEM';
  message: string;
  timestamp: string;
}

export default function Admin() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchLogs = async () => {
      try {
        const res = await axios.get('/api/admin/logs');
        setLogs(res.data.data);
      } catch (err) {
        console.error('Failed to fetch logs', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, [user, navigate]);

  const getLevelColor = (level: string) => {
    switch(level) {
      case 'ERROR': return 'text-red-500 border-red-500/20 bg-red-500/5';
      case 'WARNING': return 'text-orange-500 border-orange-500/20 bg-orange-500/5';
      case 'SYSTEM': return 'text-blue-500 border-blue-500/20 bg-blue-500/5';
      default: return 'text-green-500 border-green-500/20 bg-green-500/5';
    }
  };

  const getLevelIcon = (level: string) => {
    switch(level) {
      case 'ERROR': return <AlertCircle size={12} />;
      case 'WARNING': return <AlertTriangle size={12} />;
      case 'SYSTEM': return <Database size={12} />;
      default: return <Info size={12} />;
    }
  };

  return (
    <div className="min-h-screen pt-24 bg-[#050505] text-gray-200 px-4 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header - Technical Metric Grid */}
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={16} className="text-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            <span className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.4em]">Real-Time Diagnostics / System Audit</span>
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter italic mb-8 text-white">Admin <span className="text-gray-600">Portal</span></h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'System Health', value: 'Operational', icon: Activity, color: 'text-green-500' },
              { label: 'Agent Latency', value: '42ms', icon: Clock, color: 'text-blue-500' },
              { label: 'DB Integrity', value: '100%', icon: Database, color: 'text-blue-400' },
              { label: 'Auth Uptime', value: '99.98%', icon: Shield, color: 'text-indigo-500' }
            ].map((metric, i) => (
              <div key={i} className="bg-[#0a0a0a] border border-white/5 p-6 rounded-xl hover:bg-white/4 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">{metric.label}</span>
                  <metric.icon size={14} className={metric.color} />
                </div>
                <div className={`text-xl font-bold uppercase tracking-tight ${metric.color}`}>{metric.value}</div>
              </div>
            ))}
          </div>
        </header>

        {/* Logs Console - Data Grid Recipe Inspired */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden flex flex-col h-50 shadow-2xl">
          <div className="bg-[#0a0a0a] p-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-gray-500" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white">Server Event Logs</span>
            </div>
            <div className="flex items-center gap-4 text-[9px] font-mono text-gray-600 uppercase">
              <span className="cursor-pointer hover:text-blue-400 transition-colors underline underline-offset-4">CLEAR_LOGS</span>
              <span>Sync Mode: Automatic</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-0 font-mono text-[11px] scroller">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-[#0a0a0a] z-10 text-gray-500 uppercase tracking-widest border-b border-white/5 italic">
                <tr>
                  <th className="px-6 py-4 text-left font-normal font-serif">ID</th>
                  <th className="px-6 py-4 text-left font-normal font-serif">Level</th>
                  <th className="px-6 py-4 text-left font-normal font-serif">Timestamp</th>
                  <th className="px-6 py-4 text-left font-normal font-serif">Internal Event Payload</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-white/5 hover:bg-white/2 transition-colors group">
                    <td className="px-6 py-4 text-gray-600">[{log.id.toString(16).padStart(4, '0')}]</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 border rounded opacity-80 ${getLevelColor(log.level).replace('text-orange-500', 'text-blue-500')}`}>
                        {getLevelIcon(log.level)}
                        {log.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 uppercase">{new Date(log.timestamp).toLocaleTimeString()}</td>
                    <td className="px-6 py-4 text-gray-300 group-hover:text-white transition-colors">{log.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {loading && (
              <div className="p-12 text-center text-gray-600 animate-pulse uppercase tracking-widest text-xs">Initializing diagnostic bridge...</div>
            )}
          </div>

          <footer className="bg-black/20 p-3 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-gray-700 uppercase">
             <span>NexusStream Kernel v3.12.0</span>
             <div className="flex gap-4">
               <span>Sprint: WK1_FOUNDATIONS</span>
               <span>Region: global-relay-0</span>
             </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
