import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../context/Authcontext';
import { Lock, Mail, User, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        navigate('/shop');
      } else {
        await register(email, password, name);
        setIsLogin(true);
        setError('Acccount created. Please login.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* Left Pane - Editorial Split Recipe */}
      <div className="hidden lg:flex flex-col flex-1 bg-[#0a0a0a] p-16 justify-between border-r border-white/5">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">N</div>
          <span className="font-black tracking-tighter text-white uppercase text-lg italic">Nexus<span className="text-blue-500">Stream</span></span>
        </Link>

        <div>
           <h2 className="text-gray-500 font-mono text-xs uppercase tracking-[0.4em] mb-6">Security / Protocol</h2>
           <h1 className="text-7xl font-black uppercase tracking-tighter italic leading-[0.85] mb-8 text-white">
             Entry <br />
             <span className="text-blue-500">Access</span>
           </h1>
           <p className="max-w-md text-gray-500 font-mono text-sm leading-relaxed italic">
             Authenticate your credentials to access the world's most performant technical marketplace and digital diagnostics hub.
           </p>
        </div>

        <div className="flex items-center gap-8 text-[10px] font-mono text-gray-700 uppercase tracking-widest">
           <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-blue-500" /> Multi-Factor SSL</span>
           <span>SECURE_SESSION_V2.4</span>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 md:px-20 lg:px-40">
        <div className="max-w-sm w-full mx-auto">
          <div className="mb-10 lg:hidden">
             <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center font-bold text-white mb-4 shadow-lg shadow-blue-500/20">N</div>
             <h1 className="text-3xl font-black uppercase tracking-tighter italic text-white">{isLogin ? 'Login' : 'Register'}</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                 <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest pl-1">Identification Name</label>
                 <div className="relative">
                    <User className="absolute left-3 top-2.5 text-gray-600" size={16} />
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-xs font-mono text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                      data-testid="auth-name-input"
                    />
                 </div>
              </div>
            )}
            <div className="space-y-2">
               <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest pl-1">Root Email</label>
               <div className="relative">
                  <Mail className="absolute left-3 top-2.5 text-gray-600" size={16} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-xs font-mono text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                    data-testid="email-input"
                  />
               </div>
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest pl-1">Encrypted Key</label>
               <div className="relative">
                  <Lock className="absolute left-3 top-2.5 text-gray-600" size={16} />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-xs font-mono text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                    data-testid="password-input"
                  />
               </div>
            </div>

            {error && (
              <p 
                className="text-[10px] font-mono text-red-500 uppercase tracking-widest pl-1 animate-pulse"
                data-testid="login-error"
              >
                [AUTH_ERROR]: {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 mt-8 disabled:opacity-50"
              data-testid="login-btn"
            >
              {loading ? 'Processing...' : (isLogin ? 'Grant Access' : 'Create Identity')}
              <ArrowRight size={14} />
            </button>
          </form>

          <p className="mt-8 text-center text-xs font-mono text-gray-600 tracking-tight italic">
            {isLogin ? "No identity registered?" : "Already possess an identity?"}{' '}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-500 hover:text-blue-400 font-bold uppercase transition-colors"
              data-testid="auth-toggle"
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
