import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useWeb3 } from '@/hooks/useWeb3';
import { useToast } from '@/hooks/use-toast';

// Higher-order component to protect admin routes
export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const { isConnected, address } = useWeb3();
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    async function verifyAdminAccess() {
      try {
        setIsVerifying(true);
        
        console.log("Verifying admin access");
        
        // Check if user has admin session
        const adminSession = localStorage.getItem('adminSession');
        if (!adminSession) {
          toast({
            title: "Authentication Required",
            description: "Please log in to access the admin area.",
            variant: "destructive",
          });
          
          // Use hash-based navigation for Vercel deployment
          navigate('/admin-login');
          return;
        }

        // Parse session data
        const sessionData = JSON.parse(adminSession);
        
        // Check session expiration (8 hours)
        if (sessionData.timestamp < Date.now() - 8 * 60 * 60 * 1000) {
          localStorage.removeItem('adminSession');
          toast({
            title: "Session Expired",
            description: "Your admin session has expired. Please log in again.",
            variant: "destructive",
          });
          navigate('/admin-login');
          return;
        }

        // If using wallet login, verify wallet matches
        if (sessionData.wallet && (!isConnected || sessionData.wallet !== address)) {
          toast({
            title: "Wallet Mismatch",
            description: "Please connect with the wallet you logged in with.",
            variant: "destructive",
          });
          navigate('/admin-login');
          return;
        }

        // Verify with server
        try {
          const response = await fetch('/api/admin/dashboard', {
            headers: {
              'Authorization': `Bearer ${sessionData.token}`
            }
          });

          if (!response.ok) {
            throw new Error('Admin verification failed');
          }
          
          // Session is valid
          console.log("Admin access verified successfully");
          setIsVerifying(false);
        } catch (error) {
          // API verification failed
          console.error("Admin API verification failed:", error);
          localStorage.removeItem('adminSession');
          toast({
            title: "Authentication Error",
            description: "Your admin session could not be verified. Please log in again.",
            variant: "destructive",
          });
          navigate('/admin-login');
        }
      } catch (error) {
        // Invalid session data format
        console.error("Admin session parsing error:", error);
        localStorage.removeItem('adminSession');
        toast({
          title: "Authentication Error",
          description: "There was a problem with your session. Please log in again.",
          variant: "destructive",
        });
        navigate('/admin-login');
      }
    }

    verifyAdminAccess();
  }, [isConnected, address, toast, navigate]);

  // Show loading state while verifying
  if (isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
          <p className="text-slate-500">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // If all checks pass, render the children
  return <>{children}</>;
}
