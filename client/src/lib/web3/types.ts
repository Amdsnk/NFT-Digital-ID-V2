// Type definitions for Ethereum provider on window
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, handler: (...args: any[]) => void) => void;
      removeListener: (event: string, handler: (...args: any[]) => void) => void;
      removeAllListeners: (event: string) => void;
      selectedAddress?: string;
      chainId?: string;
    };
  }
}

export {};