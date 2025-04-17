import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface Web3FallbackProps {
  children: React.ReactNode;
}

export function Web3Fallback({ children }: Web3FallbackProps) {
  // Check if window.ethereum exists
  const hasEthereum = typeof window !== "undefined" && !!window.ethereum;

  if (!hasEthereum) {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-6 max-w-md mx-auto my-12">
        <Alert variant="destructive" className="border-2">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="mb-2">Web3 Provider Not Detected</AlertTitle>
          <AlertDescription className="space-y-4">
            <p>
              This feature requires a Web3 wallet like MetaMask to interact with blockchain features.
            </p>
            <div className="flex flex-col space-y-2">
              <a 
                href="https://metamask.io/download/" 
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full">
                  <span className="mr-2">📥</span>
                  Install MetaMask
                </Button>
              </a>
              <Button variant="outline">
                Continue Without Web3
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}