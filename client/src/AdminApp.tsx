import React from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/queryClient";
import { Web3Fallback } from "./components/web3/Web3Fallback";
import AdminLayout from "./components/layouts/AdminLayout";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/not-found";

// Lazy load admin components to ensure they're completely separate from client bundle
const AdminUserManagement = React.lazy(() => import("./pages/admin/UserManagement"));
const AdminNftManagement = React.lazy(() => import("./pages/admin/NftManagement"));
const AdminSystemSettings = React.lazy(() => import("./pages/admin/SystemSettings"));

// Admin router with admin layout
function AdminRouter() {
  return (
    <AdminLayout>
      <React.Suspense fallback={<div className="flex items-center justify-center h-screen">Loading admin panel...</div>}>
        <Switch>
          <Route path="/admin" component={AdminPage} />
          <Route path="/admin/users" component={AdminUserManagement} />
          <Route path="/admin/nfts" component={AdminNftManagement} />
          <Route path="/admin/settings" component={AdminSystemSettings} />
          <Route component={AdminPage} />
        </Switch>
      </React.Suspense>
    </AdminLayout>
  );
}

function AdminApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <Web3Fallback>
        <AdminRouter />
      </Web3Fallback>
      <Toaster />
    </QueryClientProvider>
  );
}

export default AdminApp;
