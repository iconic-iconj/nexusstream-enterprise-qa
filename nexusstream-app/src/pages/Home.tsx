import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, Shield, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-gray-200 transition-colors duration-300">
      {/* Hero Section */}
      <section className="hidden md:block relative px-4 pt-20 pb-40 max-w-7xl mx-auto" data-test="editorial-split">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded">Enterprise v2.4.1</span>
              <div className="h-px w-20 bg-gray-300 dark:bg-white/10" />
            </div>
            <h1 className="text-[12vw] md:text-8xl font-black leading-[0.85] uppercase tracking-tighter mb-8 italic text-gray-900 dark:text-white">
              Nexus <br />
              <span className="text-blue-600 dark:text-blue-500">Mastery</span> <br />
              & Data
            </h1>
            <p className="max-w-md text-gray-600 dark:text-gray-400 font-mono text-sm leading-relaxed mb-10 italic">
              "The difference between a script and an enterprise system is the depth of its audit logs and the integrity of its data bounds."
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/shop" 
                className="group flex items-center gap-3 px-8 py-4 bg-blue-600 text-white font-bold uppercase text-sm rounded-lg hover:bg-blue-500 transition-all shadow-md hover:shadow-lg"
                data-test="hero-shop-button"
              >
                Access Marketplace
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link 
                to="/login"
                className="px-8 py-4 border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 font-bold uppercase text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                data-test="hero-login-button"
              >
                Authenticate
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            {/* Image Container with natural full-color image display */}
            <div className="aspect-square bg-gray-100 dark:bg-[#0a0a0a] rounded-2xl border border-gray-200 dark:border-white/10 relative overflow-hidden group shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000" 
                alt="Cyberpunk tech"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Floating Tech Badges */}
              <div className="absolute top-8 right-8 flex flex-col gap-4">
                {[
                  { icon: Cpu, label: "POSTGRES_PROD", color: "text-green-500" },
                  { icon: Shield, label: "JWT_SECURE", color: "text-blue-500" },
                  { icon: Zap, label: "AGENT_LATENCY", color: "text-blue-400" }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + (i * 0.1) }}
                    className="flex items-center gap-3 bg-white/90 dark:bg-black/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-3 rounded-xl shadow-lg"
                  >
                    <item.icon size={16} className={item.color} />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gray-800 dark:text-gray-300 font-bold">{item.label}</span>
                  </motion.div>
                ))}
              </div>
              
              <div className="absolute bottom-8 left-8">
                 <div className="text-[10px] font-mono text-gray-300 uppercase tracking-[0.3em]">Environment_Status</div>
                 <div className="text-white font-bold uppercase tracking-tighter">Production_Stable</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="bg-white dark:bg-[#050505] border-t border-gray-200 dark:border-white/5 py-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <h2 className="text-gray-500 dark:text-gray-400 font-mono text-[10px] uppercase tracking-[0.3em] mb-4">Core Infrastructure</h2>
              <h3 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter text-gray-900 dark:text-white">
                Engineered for <br /><span className="text-blue-600 dark:text-blue-500">Scale</span>
              </h3>
            </div>
            <div className="max-w-xs text-gray-600 dark:text-gray-400 text-xs font-mono leading-relaxed italic">
              NexusStream powers high-speed data persistence and digital architecture deliveries globally.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-test="content-grid">
            {[
              { title: "RAG Persistence", desc: "A vector-optimized retrieval layer ensuring the Nexus Agent never hallucinates company policy.", id: "01", icon: Cpu },
              { title: "JWT Auth Engine", desc: "Zero-Trust architecture with secure HttpOnly cookies and multi-role access control.", id: "02", icon: Shield },
              { title: "Atomic States", desc: "Transaction-driven order fulfillment ensuring stock levels and payment logs never drift.", id: "03", icon: Zap }
            ].map((f, i) => (
              <div key={i} className="p-10 rounded-2xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/2 hover:bg-gray-100 dark:hover:bg-white/4 transition-all group">
                <div className="flex justify-between items-start mb-12">
                   <span className="text-gray-300 dark:text-gray-800 font-black text-6xl group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors uppercase italic">{f.id}</span>
                   <f.icon className="text-gray-400 dark:text-gray-700 group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors" size={24} />
                </div>
                <h4 className="text-xl font-bold mb-4 uppercase tracking-tighter text-gray-900 dark:text-white">{f.title}</h4>
                <p className="text-gray-600 dark:text-gray-400 font-mono text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}