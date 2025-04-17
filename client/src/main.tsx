import AdminApp from './AdminApp';
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, Router } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { Web3Provider } from './context/Web3Context';
import { Toaster } from './components/ui/toaster';
import AdminAuthGuard from './components/auth/AdminAuthGuard';
import AdminLogin from './pages/AdminLogin';
import './index.css';

// Force dark mode
document.documentElement.classList.add('dark');
localStorage.setItem('theme', 'dark');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Web3Provider>
        <Router>
          <Route path="/admin-login" component={AdminLogin} />
          <Route path="/admin/*">
            {(params) => (
              <AdminAuthGuard>
                <AdminApp />
              </AdminAuthGuard>
            )}
          </Route>
          <Route path="/*" component={App} />
        </Router>
        <Toaster />
      </Web3Provider>
    </QueryClientProvider>
  </React.StrictMode>,
);
