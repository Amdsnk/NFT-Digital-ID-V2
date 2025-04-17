import React, { useState } from 'react';
import { Web3Provider } from '@/context/Web3Context';
import { AlertTriangle } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface Web3ProviderWrapperProps {
  children: React.ReactNode;
}

export function Web3ProviderWrapper({ children }: Web3ProviderWrapperProps) {
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    return (
      <div className="p-6 max-w-md mx-auto my-12">
        <Alert variant="destructive" className="border-2">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="mb-2">Web3 Provider Error</AlertTitle>
          <AlertDescription>
            <p>There was an error initializing the Web3 provider:</p>
            <p className="font-mono text-sm mt-2 p-2 bg-slate-900 text-white rounded">{error.message}</p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // If no error, wrap the children with the Web3Provider
  try {
    return <Web3Provider>{children}</Web3Provider>;
  } catch (err) {
    setError(err instanceof Error ? err : new Error('Unknown error in Web3Provider'));
    return null;
  }
}