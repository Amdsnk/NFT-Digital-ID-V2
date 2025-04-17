import React from "react";
import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/queryClient";
import { Web3Fallback } from "./components/web3/Web3Fallback";
import RootLayout from "./components/layouts/RootLayout";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import NFTSoulID from "./pages/NFTSoulID";
import FlameLogPage from "./pages/FlameLogPage";
import DAOVoting from "./pages/DAOVoting";
import NotFound from "./pages/not-found";

// Main router for user interface
function Router() {
  return (
    <Switch>
      <Route>
        <RootLayout>
          <Switch>
            <Route path="/" component={LandingPage} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/nft" component={NFTSoulID} />
            <Route path="/flame-log" component={FlameLogPage} />
            <Route path="/dao" component={DAOVoting} />
            <Route component={NotFound} />
          </Switch>
        </RootLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Web3Fallback>
        <Router />
      </Web3Fallback>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
