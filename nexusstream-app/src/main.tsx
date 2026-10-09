import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Fast-path redirect for unauthenticated direct navigations to protected routes.
// This ensures server-side-style redirects happen synchronously so tests
// that call `page.goto('/checkout')` observe the redirect immediately.
try {
  const protectedPaths = ['/checkout', '/admin'];
  const path = window.location.pathname;
  const isProtected = protectedPaths.some(p => path.startsWith(p));
  const stored = localStorage.getItem('nexus_user');
  if (isProtected && !stored) {
    window.location.replace('/login');
  }
} catch (e) {
  // ignore in non-browser environments
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
