// Supported networks by chain ID
export const SUPPORTED_NETWORKS = {
  ETHEREUM: 1,
  ETHEREUM_GOERLI: 5,
  POLYGON: 137,
  POLYGON_MUMBAI: 80001,
  SOLANA_MAINNET: "mainnet-beta",
  SOLANA_DEVNET: "devnet",
};

// Network configuration
export const NETWORK_CONFIG = {
  [SUPPORTED_NETWORKS.ETHEREUM]: {
    name: "Ethereum Mainnet",
    chainId: "0x1",
    currencySymbol: "ETH",
    blockExplorer: "https://etherscan.io",
    rpcUrl: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161", // Public Infura endpoint
  },
  [SUPPORTED_NETWORKS.ETHEREUM_GOERLI]: {
    name: "Goerli Testnet",
    chainId: "0x5",
    currencySymbol: "ETH",
    blockExplorer: "https://goerli.etherscan.io",
    rpcUrl: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161", // Public Infura endpoint
  },
  [SUPPORTED_NETWORKS.POLYGON]: {
    name: "Polygon Mainnet",
    chainId: "0x89",
    currencySymbol: "MATIC",
    blockExplorer: "https://polygonscan.com",
    rpcUrl: "https://polygon-rpc.com",
  },
  [SUPPORTED_NETWORKS.POLYGON_MUMBAI]: {
    name: "Polygon Mumbai",
    chainId: "0x13881",
    currencySymbol: "MATIC",
    blockExplorer: "https://mumbai.polygonscan.com",
    rpcUrl: "https://rpc-mumbai.maticvigil.com",
  },
};

// Contract addresses
export const CONTRACT_ADDRESSES = {
  [SUPPORTED_NETWORKS.ETHEREUM]: {
    SOUL_ID_NFT: "",
    GOVERNANCE: "",
  },
  [SUPPORTED_NETWORKS.ETHEREUM_GOERLI]: {
    SOUL_ID_NFT: "",
    GOVERNANCE: "",
  },
  [SUPPORTED_NETWORKS.POLYGON]: {
    SOUL_ID_NFT: "0x7c3aed5f1d8f15ee34e4c4a066dd85dd24071a12", // Example contract address
    GOVERNANCE: "0x8b5f9a29c2b5eac8a3d9949d8e8bf9b6b6269acf", // Example contract address
  },
  [SUPPORTED_NETWORKS.POLYGON_MUMBAI]: {
    SOUL_ID_NFT: "0x5fbdb2315678afecb367f032d93f642f64180aa3", // Example contract address
    GOVERNANCE: "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512", // Example contract address
  },
};

// Default network for application
export const DEFAULT_NETWORK = SUPPORTED_NETWORKS.POLYGON_MUMBAI;

// Wallet connection types
export const WALLET_TYPES = {
  METAMASK: "metamask",
  WALLET_CONNECT: "walletconnect",
  PHANTOM: "phantom",
};
