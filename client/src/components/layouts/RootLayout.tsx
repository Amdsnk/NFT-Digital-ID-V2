import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { WalletConnect } from "../web3/WalletConnect";

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location === path;
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/nft", label: "NFT Soul ID" },
    { path: "/flame-log", label: "Flame Log" },
    { path: "/dao", label: "DAO Voting" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-gray-950 text-slate-800 dark:text-slate-200">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-primary-600 dark:text-primary-400 font-bold text-xl">FirstStepAI</span>
                <span className="ml-2 text-xs font-semibold bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 px-2 py-0.5 rounded-full">
                  Web3
                </span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`${
                      isActive(link.path)
                        ? "border-primary-500 text-primary-600 dark:text-primary-400"
                        : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
              <WalletConnect />
              <div className="flex items-center space-x-2">
                <button 
                  type="button" 
                  className="p-1 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 focus:outline-none"
                >
                  <i className="far fa-bell text-lg"></i>
                </button>
                {/* Theme toggle removed */}
              </div>
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              {/* Mobile menu button */}
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:bg-gray-800 focus:outline-none"
                aria-controls="mobile-menu"
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <i className={`fas ${mobileMenuOpen ? "fa-times" : "fa-bars"} text-xl`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`sm:hidden ${mobileMenuOpen ? "" : "hidden"}`} id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`${
                  isActive(link.path)
                    ? "bg-primary-50 dark:bg-primary-900/30 border-l-4 border-primary-500 dark:border-primary-500 text-primary-700 dark:text-primary-400"
                    : "border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-gray-800"
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
{/* Admin link removed from client navigation */}
          </div>
          <div className="pt-4 pb-3 border-t border-slate-200 dark:border-gray-800">
            <div className="flex items-center px-4">
              <div className="ml-auto flex-shrink-0 flex space-x-4">
                <div className="w-full">
                  <WalletConnect />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 relative overflow-y-auto focus:outline-none">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 shadow-sm mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              &copy; 2023 FirstStepAI. All rights reserved.
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400 space-x-3">
              <a href="#" className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300">
                Terms
              </a>
              <span>·</span>
              <a href="#" className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300">
                Privacy
              </a>
              <span>·</span>
              <a href="#" className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RootLayout;
