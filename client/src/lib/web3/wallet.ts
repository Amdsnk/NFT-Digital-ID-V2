import { NETWORK_CONFIG, SUPPORTED_NETWORKS, WALLET_TYPES } from "./constants";

// Define interface for a wallet provider
export interface IWalletProvider {
  connect(): Promise<{
    address: string;
    chainId: number | string;
  }>;
  disconnect(): Promise<void>;
  getAddress(): Promise<string | null>;
  getChainId(): Promise<number | string | null>;
  switchNetwork(chainId: number | string): Promise<boolean>;
  signMessage(message: string): Promise<string>;
}

// Implementation for MetaMask/Ethereum provider
export class EthereumWalletProvider implements IWalletProvider {
  private provider: any;

  constructor() {
    // @ts-ignore
    this.provider = window.ethereum;
  }

  isAvailable(): boolean {
    return !!this.provider;
  }

  async connect(): Promise<{
    address: string;
    chainId: number | string;
  }> {
    if (!this.isAvailable()) {
      throw new Error("MetaMask is not installed");
    }

    try {
      const accounts = await this.provider.request({
        method: "eth_requestAccounts",
      });

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found");
      }

      const chainId = await this.getChainId();
      if (!chainId) {
        throw new Error("Could not detect network");
      }

      return {
        address: accounts[0],
        chainId,
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to connect to MetaMask");
    }
  }

  async disconnect(): Promise<void> {
    // MetaMask doesn't have a disconnect method, so we just clear our stored state
    return Promise.resolve();
  }

  async getAddress(): Promise<string | null> {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const accounts = await this.provider.request({
        method: "eth_accounts",
      });
      return accounts.length > 0 ? accounts[0] : null;
    } catch (error) {
      console.error("Error fetching address", error);
      return null;
    }
  }

  async getChainId(): Promise<number | null> {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const chainId = await this.provider.request({
        method: "eth_chainId",
      });
      return parseInt(chainId, 16);
    } catch (error) {
      console.error("Error fetching chain ID", error);
      return null;
    }
  }

  async switchNetwork(chainId: number): Promise<boolean> {
    if (!this.isAvailable()) {
      return false;
    }

    const hexChainId = `0x${chainId.toString(16)}`;
    const network = NETWORK_CONFIG[chainId];

    if (!network) {
      throw new Error(`Network with chain ID ${chainId} is not supported`);
    }

    try {
      await this.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: hexChainId }],
      });
      return true;
    } catch (error: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (error.code === 4902) {
        try {
          await this.provider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: hexChainId,
                chainName: network.name,
                nativeCurrency: {
                  name: network.currencySymbol,
                  symbol: network.currencySymbol,
                  decimals: 18,
                },
                rpcUrls: [network.rpcUrl],
                blockExplorerUrls: [network.blockExplorer],
              },
            ],
          });
          return true;
        } catch (addError) {
          console.error("Error adding network", addError);
          return false;
        }
      }
      console.error("Error switching network", error);
      return false;
    }
  }

  async signMessage(message: string): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error("MetaMask is not installed");
    }

    const address = await this.getAddress();
    if (!address) {
      throw new Error("No connected account");
    }

    try {
      const signature = await this.provider.request({
        method: "personal_sign",
        params: [message, address],
      });
      return signature;
    } catch (error: any) {
      throw new Error(error.message || "Failed to sign message");
    }
  }
}

// Wallet Connect Provider (simplified for this demo)
export class WalletConnectProvider implements IWalletProvider {
  async connect(): Promise<{ address: string; chainId: number | string }> {
    throw new Error("WalletConnect not implemented in this demo");
  }

  async disconnect(): Promise<void> {
    return Promise.resolve();
  }

  async getAddress(): Promise<string | null> {
    return null;
  }

  async getChainId(): Promise<number | string | null> {
    return null;
  }

  async switchNetwork(chainId: number | string): Promise<boolean> {
    return false;
  }

  async signMessage(message: string): Promise<string> {
    throw new Error("WalletConnect not implemented in this demo");
  }
}

// Phantom (Solana) Provider (simplified for this demo)
export class PhantomProvider implements IWalletProvider {
  async connect(): Promise<{ address: string; chainId: number | string }> {
    throw new Error("Phantom not implemented in this demo");
  }

  async disconnect(): Promise<void> {
    return Promise.resolve();
  }

  async getAddress(): Promise<string | null> {
    return null;
  }

  async getChainId(): Promise<number | string | null> {
    return null;
  }

  async switchNetwork(chainId: number | string): Promise<boolean> {
    return false;
  }

  async signMessage(message: string): Promise<string> {
    throw new Error("Phantom not implemented in this demo");
  }
}

// Factory function to get wallet provider based on type
export function getWalletProvider(type: string): IWalletProvider {
  switch (type) {
    case WALLET_TYPES.METAMASK:
      return new EthereumWalletProvider();
    case WALLET_TYPES.WALLET_CONNECT:
      return new WalletConnectProvider();
    case WALLET_TYPES.PHANTOM:
      return new PhantomProvider();
    default:
      return new EthereumWalletProvider();
  }
}
