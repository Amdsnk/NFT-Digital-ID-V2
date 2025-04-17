import { useQuery } from "@tanstack/react-query";
import { useWeb3 } from "./useWeb3";
import { fetchNftMetadata } from "@/lib/web3/contracts";
import { mockNfts } from "@/lib/mockData";

export function useNftDetails() {
  const { address, isConnected } = useWeb3();

  // Enhanced mock NFT data with more details
  const enhancedMockNft = {
    id: 1,
    tokenId: 'FSAI00001',
    userId: 1,
    metadata: {
      name: 'Soul ID #FSAI00001',
      description: 'A non-transferable identity NFT for the FirstStepAI ecosystem',
      image: 'https://via.placeholder.com/500',
      contractAddress: '0x7c3aed5f1d8f15ee34e4c4a066dd85dd24071a12',
      attributes: [
        { trait_type: 'Level', value: 3 },
        { trait_type: 'Trust Score', value: 72 },
        { trait_type: 'Creation Date', value: '2024-01-15T00:00:00Z' }
      ]
    },
    network: 'Polygon Mumbai',
    isActive: true,
    mintedAt: new Date('2024-01-15').toISOString()
  };

  const {
    data: nft,
    isLoading: queryIsLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["/api/nfts/user/1"], // In a real app, this would be the user's ID
    enabled: isConnected && !!address,
    staleTime: 300 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    initialData: enhancedMockNft // Use enhanced mock data as initial data
  });

  // If there's real data, use it. Otherwise for demonstration purposes,
  // we'll create a sample NFT if there's a connected wallet address
  const nftData = nft || (address ? enhancedMockNft : null);

  // Consider it loading if the query is loading or if we're connected but don't have an address yet
  const isLoading = queryIsLoading || (isConnected && !address);

  // Format error message based on the type of error
  const errorMessage = queryError
    ? queryError instanceof Error
      ? queryError.message
      : typeof queryError === 'string'
        ? queryError
        : 'Failed to load NFT data. Please try again later.'
    : null;

  return {
    nft: nftData,
    isLoading,
    error: errorMessage,
    refetch,
  };
}
