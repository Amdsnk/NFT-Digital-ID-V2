import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  const [, navigate] = useLocation();

  useEffect(() => {
    // If the path is admin-login, redirect to the correct path
    const path = window.location.pathname;
    if (path === '/admin-login') {
      navigate('/admin-login');
      return;
    }
    
    // If the path starts with /admin/ redirect to admin
    if (path.startsWith('/admin/')) {
      navigate('/admin');
      return;
    }
  }, [navigate]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-gray-950">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">404 Page Not Found</h1>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <Link href="/">
              <Button>
                <i className="fas fa-home mr-2"></i> Return to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
