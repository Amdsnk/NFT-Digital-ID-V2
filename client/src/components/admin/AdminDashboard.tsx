import { useState } from "react";
import { AdminStats } from "./AdminStats";
import { PendingApprovals } from "./PendingApprovals";
import { Button } from "@/components/ui/button";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("approvals");

  const renderTabContent = () => {
    switch (activeTab) {
      case "approvals":
        return <PendingApprovals />;
      case "users":
        return <UserManagementTab />;
      case "transfers":
        return <NFTTransfersTab />;
      case "logs":
        return <ActivityLogsTab />;
      default:
        return <PendingApprovals />;
    }
  };

  return (
    <div id="admin-dashboard" className="mt-12 pt-8 border-t-2 border-slate-200 dark:border-slate-700">
      <div className="pb-5 border-b border-slate-200 dark:border-slate-700 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold leading-6 text-slate-900 dark:text-white sm:truncate">
          <i className="fas fa-shield-alt mr-2 text-primary-500"></i> Admin Dashboard
        </h1>
        <div className="mt-3 flex sm:mt-0 sm:ml-4">
          <Button>
            <i className="fas fa-download mr-2"></i>
            Export Data
          </Button>
        </div>
      </div>

      <AdminStats />

      {/* Admin Action Tabs */}
      <div className="mt-8">
        <div className="border-b border-slate-200 dark:border-slate-700">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <Button
              variant="link"
              className={`whitespace-nowrap py-4 px-1 border-b-2 text-sm font-medium ${
                activeTab === "approvals"
                  ? "border-primary-500 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600"
              }`}
              onClick={() => setActiveTab("approvals")}
            >
              Pending Approvals
            </Button>
            <Button
              variant="link"
              className={`whitespace-nowrap py-4 px-1 border-b-2 text-sm font-medium ${
                activeTab === "users"
                  ? "border-primary-500 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600"
              }`}
              onClick={() => setActiveTab("users")}
            >
              User Management
            </Button>
            <Button
              variant="link"
              className={`whitespace-nowrap py-4 px-1 border-b-2 text-sm font-medium ${
                activeTab === "transfers"
                  ? "border-primary-500 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600"
              }`}
              onClick={() => setActiveTab("transfers")}
            >
              NFT Transfers
            </Button>
            <Button
              variant="link"
              className={`whitespace-nowrap py-4 px-1 border-b-2 text-sm font-medium ${
                activeTab === "logs"
                  ? "border-primary-500 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600"
              }`}
              onClick={() => setActiveTab("logs")}
            >
              Activity Logs
            </Button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

function UserManagementTab() {
  return (
    <div className="bg-white dark:bg-gray-900 overflow-hidden shadow rounded-lg">
      <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-base font-medium text-slate-900 dark:text-white">User Management</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">View and manage platform users</p>
      </div>
      <div className="p-6 text-center">
        <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <i className="fas fa-users text-slate-400 dark:text-slate-500 text-2xl"></i>
        </div>
        <h3 className="text-base font-medium text-slate-900 dark:text-white mb-1">User Management Dashboard</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
          View, search, and manage all users in the system. Adjust trust scores, reset accounts, and manage permissions.
        </p>
        <Button>
          <i className="fas fa-user-cog mr-2"></i> Open User Manager
        </Button>
      </div>
    </div>
  );
}

function NFTTransfersTab() {
  return (
    <div className="bg-white dark:bg-gray-900 overflow-hidden shadow rounded-lg">
      <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-base font-medium text-slate-900 dark:text-white">NFT Transfers</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage and track NFT transfer requests</p>
      </div>
      <div className="p-6 text-center">
        <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <i className="fas fa-exchange-alt text-slate-400 dark:text-slate-500 text-2xl"></i>
        </div>
        <h3 className="text-base font-medium text-slate-900 dark:text-white mb-1">NFT Transfer History</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
          View all approved, pending, and rejected NFT transfer requests. Manage NFT inheritance and special transfers.
        </p>
        <Button>
          <i className="fas fa-history mr-2"></i> View Transfer History
        </Button>
      </div>
    </div>
  );
}

function ActivityLogsTab() {
  return (
    <div className="bg-white dark:bg-gray-900 overflow-hidden shadow rounded-lg">
      <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-base font-medium text-slate-900 dark:text-white">Activity Logs</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Review system and user activity logs</p>
      </div>
      <div className="p-6 text-center">
        <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <i className="fas fa-clipboard-list text-slate-400 dark:text-slate-500 text-2xl"></i>
        </div>
        <h3 className="text-base font-medium text-slate-900 dark:text-white mb-1">System Activity Logs</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
          Access detailed logs of user actions, system events, and administrative changes. Filter by date, action type, or user.
        </p>
        <Button>
          <i className="fas fa-search mr-2"></i> Open Log Explorer
        </Button>
      </div>
    </div>
  );
}
