import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useWeb3 } from "@/hooks/useWeb3";
import { AlertCircle, ShieldAlert, Users, BadgeCheck, Settings } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const { address, isConnected } = useWeb3();
  const { toast } = useToast();

  // In a real app, we would check if the connected wallet belongs to an admin
  // For production, this would use a more robust admin verification system
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (isConnected && address) {
        try {
          // Simulate API call to check admin status
          // In production, this would be a real API call to backend with authentication
          const adminWallets = [
            // List of admin wallet addresses (for production, this would come from backend)
            "0x3eB7B2D8754C25A3C1D5D6D0b4bA12aD20042381",
            "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
            "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
          ];
          
          // For demo, we'll assume connected wallet is admin
          // In production, uncomment this code to check against admin list:
          // const isUserAdmin = adminWallets.some(wallet => 
          //   wallet.toLowerCase() === address.toLowerCase()
          // );
          const isUserAdmin = true; // Demo mode: all wallets have admin access

          setIsAdmin(isUserAdmin);
          
          if (!isUserAdmin) {
            toast({
              title: "Access Denied",
              description: "Your wallet does not have administrator privileges",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
          toast({
            title: "Authentication Error",
            description: "Could not verify your admin privileges",
            variant: "destructive",
          });
        }
      } else {
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [address, isConnected, toast]);

  useEffect(() => {
    if (!isConnected) {
      toast({
        title: "Authentication Required",
        description: "Please connect your wallet to access the admin panel",
        variant: "destructive",
      });
    }
  }, [isConnected, toast]);

  // Loading state
  if (isAdmin === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-t-4 border-primary-500 border-solid rounded-full animate-spin mb-4"></div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Verifying Admin Access</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Please wait while we verify your administrator credentials...</p>
      </div>
    );
  }

  // Not connected state
  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShieldAlert className="mr-2 h-5 w-5 text-amber-500" />
              Admin Authentication Required
            </CardTitle>
            <CardDescription>
              Connect your wallet to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-6">
            <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-full flex items-center justify-center mb-4">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <p className="text-center text-slate-600 dark:text-slate-400 mb-6">
              The admin dashboard is restricted to authorized personnel only. You need to connect your wallet and have admin privileges to access this section.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not admin state
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
              Access Denied
            </CardTitle>
            <CardDescription>
              Your wallet does not have administrator privileges
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-6">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-center text-slate-600 dark:text-slate-400 mb-6">
              The connected wallet does not have administrator privileges. If you believe this is an error, please contact the system administrator.
            </p>
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Authentication Error</AlertTitle>
              <AlertDescription>
                Wallet address {address?.slice(0, 6)}...{address?.slice(-4)} is not on the admin whitelist.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin dashboard state
  return (
    <div>
      <div className="pb-5 border-b border-slate-200 dark:border-slate-700 sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold leading-6 text-slate-900 dark:text-white sm:truncate flex items-center">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Manage the FirstStepAI Web3 Identity System
          </p>
        </div>
      </div>

      <AdminDashboard />

      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-6">Admin Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/users">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-primary-500" />
                  User Management
                </CardTitle>
                <CardDescription>Manage system users</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  Add, edit, or remove users. Adjust trust scores and manage permissions.
                </p>
                <div className="mt-2 flex justify-end">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    12 users active
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/admin/nfts">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BadgeCheck className="mr-2 h-5 w-5 text-primary-500" />
                  NFT Management
                </CardTitle>
                <CardDescription>Manage Soul IDs</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  Issue new Soul IDs, revoke existing ones, and handle transfers.
                </p>
                <div className="mt-2 flex justify-end">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    8 NFTs issued
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/admin/settings">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5 text-primary-500" />
                  System Settings
                </CardTitle>
                <CardDescription>Configure the platform</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  Configure system parameters, badge requirements, and governance settings.
                </p>
                <div className="mt-2 flex justify-end">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    3 pending changes
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
