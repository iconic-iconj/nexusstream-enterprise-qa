import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, LogOut, Terminal, LayoutGrid } from 'lucide-react';

export default function Navigation() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group" data-test="nav-logo">
          <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center font-bold text-white group-hover:rotate-12 transition-transform">N</div>
          <span className="font-bold tracking-tighter text-white uppercase text-sm">Nexus<span className="text-blue-500">Stream</span> <span className="ml-2 hidden sm:inline-block rounded border border-white/20 px-2 py-0.5 text-[10px] uppercase tracking-widest text-gray-400 font-mono">Enterprise</span></span>
        </Link>

        <div className="flex items-center gap-8">
          <Link to="/shop" className="text-sm font-medium text-gray-400 hover:text-white transition-colors" data-test="nav-shop">Marketplace</Link>
          <Link to="/admin" className="text-sm font-medium text-gray-400 hover:text-white transition-colors hidden md:block" data-test="nav-admin">
            <div className="flex items-center gap-1">
              <Terminal size={14} />
              <span>Diagnostics</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/checkout" className="relative p-2 text-gray-400 hover:text-white transition-colors" data-test="nav-cart">
            <ShoppingCart size={20} />
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {items.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-4 pl-4 border-l border-white/10">
              <div className="flex flex-col items-end">
                <span className="text-xs font-semibold text-white">{user.name}</span>
                <span className="text-[10px] text-blue-500 uppercase tracking-widest font-mono">{user.role}</span>
              </div>
              <button 
                onClick={async () => { await logout(); navigate('/'); }}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                data-test="nav-logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="px-4 py-1.5 bg-blue-600 text-white text-sm font-bold rounded hover:bg-blue-500 transition-colors"
              data-test="nav-login"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
