import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useWeb3 } from '@/hooks/useWeb3';
import { Lock, LogIn, User } from 'lucide-react';
import { WalletConnect } from '@/components/web3/WalletConnect';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'wallet' | 'credentials'>('wallet');
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  const { address, isConnected, connect } = useWeb3();
  const [initialized, setInitialized] = useState(false);

  // Check if already logged in
  useEffect(() => {
    // Only check for existing admin session
    const adminSession = localStorage.getItem('adminSession');
    if (adminSession) {
      try {
        const sessionData = JSON.parse(adminSession);
        // Check session expiration (8 hours)
        if (sessionData.timestamp > Date.now() - 8 * 60 * 60 * 1000) {
          // Still valid, redirect to admin
          navigate('/admin');
        } else {
          // Expired session
          localStorage.removeItem('adminSession');
        }
      } catch (e) {
        // Invalid session data
        localStorage.removeItem('adminSession');
      }
    }
  }, [navigate]);

  // Ensure we're at the right URL when directly accessing this page
  useEffect(() => {
    if (!initialized) return;
    
    console.log('AdminLogin component loaded', window.location.pathname, window.location.hash);
    document.title = 'Admin Login | NFT Soul Dashboard';
    
    // Only redirect if we're on /admin-login path without the hash and
    // we haven't already redirected (to prevent loops)
    const path = window.location.pathname;
    const redirected = sessionStorage.getItem('admin-login-redirected');
    
    if (path === '/admin-login' && 
        !window.location.hash.includes('/admin-login') && 
        !redirected) {
      // Mark that we've redirected once
      sessionStorage.setItem('admin-login-redirected', 'true');
      window.location.replace('/#/admin-login');
    }
  }, [initialized]);

  const handleWalletLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if wallet is connected
      if (!address) {
        toast({
          title: "Wallet Not Connected",
          description: "Please connect your wallet first.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Call the login API with wallet address
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: address,
          password: password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Check if user is admin
      if (!data.user.isAdmin) {
        toast({
          title: "Access Denied",
          description: "This account does not have admin privileges.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Set admin session in localStorage
      localStorage.setItem('adminSession', JSON.stringify({
        isAdmin: true,
        wallet: address,
        token: data.token,
        timestamp: Date.now()
      }));

      toast({
        title: "Login Successful",
        description: "Welcome to the admin dashboard.",
      });

      // Navigate to admin dashboard using standard navigate
      navigate('/admin');
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate inputs
      if (!username || !password) {
        toast({
          title: "Missing Information",
          description: "Please provide both username and password.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Call the admin login API
      const response = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Set admin session in localStorage
      localStorage.setItem('adminSession', JSON.stringify({
        isAdmin: true,
        username: username,
        token: data.token,
        timestamp: Date.now()
      }));

      toast({
        title: "Login Successful",
        description: "Welcome to the admin dashboard.",
      });

      // Navigate to admin dashboard using standard navigate
      navigate('/admin');
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-6">
            <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center">
              <Lock className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Sign in to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2 mb-4">
            <Button 
              variant={loginMethod === 'wallet' ? 'default' : 'outline'} 
              className="flex-1"
              onClick={() => setLoginMethod('wallet')}
            >
              Wallet
            </Button>
            <Button 
              variant={loginMethod === 'credentials' ? 'default' : 'outline'} 
              className="flex-1"
              onClick={() => setLoginMethod('credentials')}
            >
              Username
            </Button>
          </div>

          {loginMethod === 'wallet' ? (
            <>
              {isConnected ? (
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
                  <div className="font-mono text-sm truncate">
                    {address}
                  </div>
                </div>
              ) : (
                <WalletConnect />
              )}

              <form onSubmit={handleWalletLogin} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={!address || isLoading}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={!address || isLoading || !password}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                      Logging in...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <LogIn className="mr-2 h-4 w-4" />
                      Login with Wallet
                    </div>
                  )}
                </Button>
              </form>
            </>
          ) : (
            <form onSubmit={handleCredentialsLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="username"
                  type="text"
                  placeholder="Admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Input
                  id="password"
                  type="password"
                  placeholder="Admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !username || !password}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                    Logging in...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Login with Credentials
                  </div>
                )}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-xs text-center text-slate-500 dark:text-slate-400">
            Only authorized administrators can access this area.
          </div>
          <Button 
            variant="link" 
            className="text-xs" 
            onClick={() => navigate('/')}
          >
            Return to User Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
