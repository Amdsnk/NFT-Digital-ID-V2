import React, { ReactNode, useState } from "react";
import { useLocation, Link } from "wouter";
import { useWeb3 } from "@/hooks/useWeb3";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  BadgeCheck,
  Settings,
  LogOut,
  ChevronRight,
  BarChart,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const { address, disconnect } = useWeb3();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [menuMobileOpen, setMenuMobileOpen] = useState(false);

  // Sidebar navigation items  
  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard, current: location === "/admin" },
    { name: "User Management", href: "/admin/users", icon: Users, current: location === "/admin/users" },
    { name: "NFT Management", href: "/admin/nfts", icon: BadgeCheck, current: location === "/admin/nfts" },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart, current: location === "/admin/analytics" },
    { name: "System Settings", href: "/admin/settings", icon: Settings, current: location === "/admin/settings" },
  ];

  // Format wallet address for display
  const formattedAddress = address 
    ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
    : '';

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Mobile menu button and header - only visible on mobile */}
      <div className="flex md:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-2">
        <Button variant="ghost" size="icon" onClick={() => setMenuMobileOpen(true)}>
          <Menu className="h-6 w-6" />
        </Button>
        <div className="flex-1 flex justify-center items-center">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        {/* Theme toggle removed */}
      </div>

      {/* Unified Sidebar - Responsive for both mobile and desktop */}
      <div className={cn(
        "fixed inset-y-0 z-50 flex flex-col",
        menuMobileOpen ? "left-0 right-0 md:left-0 md:right-auto" : "-left-full md:left-0",
        "md:flex"
      )}>
        {/* Mobile overlay */}
        {menuMobileOpen && (
          <div className="fixed inset-0 bg-black/50 md:hidden" onClick={() => setMenuMobileOpen(false)} />
        )}
        
        {/* Sidebar content */}
        <div className={cn(
          "relative flex h-full flex-col",
          "w-full sm:w-64 md:w-auto",
          "bg-white dark:bg-slate-900",
          "transition-all duration-300 ease-in-out",
          sidebarOpen ? "md:w-64" : "md:w-20"
        )}>
          {/* Mobile close button */}
          <div className="flex md:hidden items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-semibold">Admin Menu</h2>
            <Button variant="ghost" size="icon" onClick={() => setMenuMobileOpen(false)}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Desktop header */}
          <div className="hidden md:flex h-16 shrink-0 items-center border-b border-slate-200 dark:border-slate-800 px-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">FS</span>
              </div>
              {sidebarOpen && (
                <span className="text-xl font-bold">FirstStepAI</span>
              )}
            </div>
            <div className="flex grow justify-end">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar}
                className="h-8 w-8"
              >
                <ChevronRight className={cn(
                  "h-4 w-4 transition-transform",
                  sidebarOpen ? "" : "rotate-180"
                )} />
              </Button>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => setMenuMobileOpen(false)}
              >
                <a className={cn(
                  item.current
                    ? 'bg-slate-100 dark:bg-slate-800 text-primary-600 dark:text-primary-500'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900',
                  'group flex items-center px-3 py-2 text-base font-medium rounded-md'
                )}>
                  <item.icon 
                    className={cn(
                      item.current 
                        ? 'text-primary-500' 
                        : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-400',
                      'h-6 w-6 shrink-0',
                      !sidebarOpen && 'md:mx-auto'
                    )} 
                    aria-hidden="true" 
                  />
                  {(menuMobileOpen || sidebarOpen) && (
                    <span className="ml-3">{item.name}</span>
                  )}
                </a>
              </Link>
            ))}
          </nav>
          
          {/* User profile */}
          <div className="shrink-0 border-t border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mr-2">
                  <span className="text-primary-700 dark:text-primary-300 text-sm font-medium">A</span>
                </div>
                {(menuMobileOpen || sidebarOpen) && (
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Admin</p>
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-500 truncate max-w-28">
                      {formattedAddress}
                    </p>
                  </div>
                )}
              </div>
              {(menuMobileOpen || sidebarOpen) && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    disconnect?.();
                    setMenuMobileOpen(false);
                  }}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        sidebarOpen ? "md:pl-64" : "md:pl-20",
        "pt-16 md:pt-0" // Add top padding for mobile nav
      )}>
        <main className="px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
