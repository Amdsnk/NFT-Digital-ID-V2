import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';

// Define the shape of our Web3 context
interface Web3ContextType {
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connectedChain: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  checkAuthentication: () => boolean;
  switchNetwork: (chainId: number) => Promise<void>;
  preferredNetwork: number;
}

// Create the context with default values
const Web3Context = createContext<Web3ContextType>({
  provider: null,
  signer: null,
  address: null,
  chainId: null,
  isConnected: false,
  isConnecting: false,
  error: null,
  connectedChain: null,
  connect: async () => {},
  disconnect: async () => {},
  isAuthenticated: false,
  isAdmin: false,
  checkAuthentication: () => false,
  switchNetwork: async () => {},
  preferredNetwork: 137, // Default to Polygon Mainnet
});

// List of supported networks
const SUPPORTED_NETWORKS = {
  1: 'Ethereum Mainnet',
  137: 'Polygon Mainnet',
  80001: 'Polygon Mumbai Testnet',
  5: 'Goerli Testnet',
  11155111: 'Sepolia Testnet'
};

// Network configuration details
const NETWORK_CONFIG = {
  1: {
    chainId: '0x1',
    chainName: 'Ethereum Mainnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://mainnet.infura.io/v3/'],
    blockExplorerUrls: ['https://etherscan.io']
  },
  137: {
    chainId: '0x89',
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    rpcUrls: ['https://polygon-rpc.com/'],
    blockExplorerUrls: ['https://polygonscan.com']
  },
  80001: {
    chainId: '0x13881',
    chainName: 'Polygon Mumbai Testnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com']
  },
  5: {
    chainId: '0x5',
    chainName: 'Goerli Testnet',
    nativeCurrency: {
      name: 'Goerli Ether',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://goerli.infura.io/v3/'],
    blockExplorerUrls: ['https://goerli.etherscan.io']
  },
  11155111: {
    chainId: '0xaa36a7',
    chainName: 'Sepolia Testnet',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://sepolia.infura.io/v3/'],
    blockExplorerUrls: ['https://sepolia.etherscan.io']
  }
};

// List of admin wallet addresses (in a real app, this would be fetched from a secure backend)
const ADMIN_WALLETS = [
  "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  "0x3A4e27b5B3A5A2Cc98843De9F2848974C1c05ecB"
];

// Provider component
export function Web3Provider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectedChain, setConnectedChain] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [preferredNetwork, setPreferredNetwork] = useState<number>(137); // Default to Polygon Mainnet
  
  const { toast } = useToast();

  // Function to connect to wallet
  const connect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // Check if window.ethereum is available
      if (!window.ethereum) {
        throw new Error("No Ethereum wallet found. Please install MetaMask or another compatible wallet.");
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Create ethers provider
      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      const ethersSigner = await ethersProvider.getSigner();
      const userAddress = await ethersSigner.getAddress();
      const network = await ethersProvider.getNetwork();
      const networkChainId = Number(network.chainId);
      
      // Check if the network is supported
      const networkName = SUPPORTED_NETWORKS[networkChainId as keyof typeof SUPPORTED_NETWORKS];
      
      setProvider(ethersProvider);
      setSigner(ethersSigner);
      setAddress(userAddress);
      setChainId(networkChainId);
      setIsConnected(true);
      setConnectedChain(networkName || `Chain ID: ${networkChainId}`);
      
      // Check if the connected wallet is an admin wallet
      setIsAdmin(ADMIN_WALLETS.includes(userAddress));
      
      // Check if user has a valid session
      const session = localStorage.getItem('userSession');
      if (session) {
        const sessionData = JSON.parse(session);
        if (sessionData.wallet === userAddress && sessionData.timestamp > Date.now() - 24 * 60 * 60 * 1000) {
          setIsAuthenticated(true);
        } else {
          // Session expired or wallet mismatch
          localStorage.removeItem('userSession');
        }
      }
      
      // Create a new session if not authenticated
      if (!isAuthenticated) {
        localStorage.setItem('userSession', JSON.stringify({
          wallet: userAddress,
          timestamp: Date.now()
        }));
        setIsAuthenticated(true);
      }
      
      // Check admin session
      const adminSession = localStorage.getItem('adminSession');
      if (adminSession && isAdmin) {
        const adminSessionData = JSON.parse(adminSession);
        if (adminSessionData.wallet === userAddress && adminSessionData.timestamp > Date.now() - 8 * 60 * 60 * 1000) {
          setIsAdmin(true);
        } else {
          // Admin session expired or wallet mismatch
          localStorage.removeItem('adminSession');
        }
      }
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${networkName || networkChainId} with address ${userAddress.substring(0, 6)}...${userAddress.substring(userAddress.length - 4)}`,
      });
      
      // Check if user is on the preferred network
      if (networkChainId !== preferredNetwork) {
        toast({
          title: "Network Mismatch",
          description: `You are connected to ${networkName || networkChainId}, but this app works best on ${SUPPORTED_NETWORKS[preferredNetwork as keyof typeof SUPPORTED_NETWORKS]}. Would you like to switch?`,
          action: {
            label: "Switch Network",
            onClick: () => switchNetwork(preferredNetwork)
          }
        });
      }
    } catch (err: any) {
      console.error("Connection error:", err);
      setError(err.message || "Failed to connect to wallet");
      toast({
        title: "Connection Failed",
        description: err.message || "Failed to connect to wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  // Function to disconnect from wallet
  const disconnect = async () => {
    setProvider(null);
    setSigner(null);
    setAddress(null);
    setChainId(null);
    setIsConnected(false);
    setConnectedChain(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    
    // Clear sessions
    localStorage.removeItem('userSession');
    localStorage.removeItem('adminSession');
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected successfully.",
    });
  };
  
  // Function to check if user is authenticated
  const checkAuthentication = () => {
    if (!isConnected) return false;
    
    // Check user session
    const session = localStorage.getItem('userSession');
    if (session) {
      const sessionData = JSON.parse(session);
      if (sessionData.wallet === address && sessionData.timestamp > Date.now() - 24 * 60 * 60 * 1000) {
        return true;
      }
    }
    
    return false;
  };
  
  // Function to switch networks
  const switchNetwork = async (targetChainId: number) => {
    if (!window.ethereum) {
      toast({
        title: "No Wallet Found",
        description: "Please install MetaMask or another compatible wallet.",
        variant: "destructive",
      });
      return;
    }
    
    const targetChainIdHex = `0x${targetChainId.toString(16)}`;
    
    try {
      // Try to switch to the network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: targetChainIdHex }],
      });
      
      toast({
        title: "Network Switched",
        description: `Successfully switched to ${SUPPORTED_NETWORKS[targetChainId as keyof typeof SUPPORTED_NETWORKS]}`,
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          const networkConfig = NETWORK_CONFIG[targetChainId as keyof typeof NETWORK_CONFIG];
          
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [networkConfig],
          });
          
          toast({
            title: "Network Added",
            description: `Successfully added and switched to ${SUPPORTED_NETWORKS[targetChainId as keyof typeof SUPPORTED_NETWORKS]}`,
          });
        } catch (addError) {
          console.error("Error adding network:", addError);
          toast({
            title: "Network Switch Failed",
            description: "Failed to add the network to your wallet. Please add it manually.",
            variant: "destructive",
          });
        }
      } else {
        console.error("Error switching network:", switchError);
        toast({
          title: "Network Switch Failed",
          description: "Failed to switch networks. Please try again or switch manually in your wallet.",
          variant: "destructive",
        });
      }
    }
  };

  // Set up event listeners for account and chain changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnect();
        } else if (accounts[0] !== address) {
          // User switched accounts
          window.location.reload();
        }
      };

      const handleChainChanged = () => {
        // Reload the page when the chain changes
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // Clean up event listeners
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [address]);

  // Removed auto-connection on page load as per requirements
  // User must explicitly click the connect button to connect wallet

  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        address,
        chainId,
        isConnected,
        isConnecting,
        error,
        connectedChain,
        connect,
        disconnect,
        isAuthenticated,
        isAdmin,
        checkAuthentication,
        switchNetwork,
        preferredNetwork
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

// Custom hook to use the Web3 context
export function useWeb3() {
  return useContext(Web3Context);
}

export default Web3Context;
