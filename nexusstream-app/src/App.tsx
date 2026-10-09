import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { AuthProvider, useAuth } from './context/Authcontext';
import { CartProvider } from './context/CartContext';
import Navigation from './components/Navigation';
import NexusAgent from './components/NexusAgent';

// Lazy load pages for performance
import Home from './pages/Home';
import Shop from './pages/Shop';
import Auth from './pages/Auth';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';

function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PageTransition><Home /></PageTransition>} />
      <Route path="/shop" element={<PageTransition><Shop /></PageTransition>} />
      <Route path="/login" element={<PageTransition><Auth /></PageTransition>} />
      <Route path="/checkout" element={<ProtectedRoute><PageTransition><Checkout /></PageTransition></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><PageTransition><Admin /></PageTransition></ProtectedRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="relative min-h-screen bg-neutral-950 flex flex-col">
            <Navigation />
            <main className="flex-1">
              <AppRoutes />
            </main>
            <NexusAgent />
            
            {/* Global Overlay Scanlines for Technical Feel */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_2px,3px_100%] z-100" data-testid="scanline-overlay" />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
