import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useWeb3 } from "./useWeb3";
import { mockProposals } from "@/lib/mockData";
import type { Proposal } from "@/shared/schema";

// Using the Proposal type from schema instead
/*interface Proposal {
  id: number;
  title: string;
  description: string;
  creatorId: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  votesFor: number;
  votesAgainst: number;
  createdAt: string;
}
*/

export function useProposals() {
  const { address, isConnected } = useWeb3();
  const queryClient = useQueryClient();

  const {
    data: proposals,
    isLoading,
    error,
    refetch,
  } = useQuery<Proposal[]>({
    queryKey: ['/api/proposals?active=true'],
    staleTime: 60 * 1000, // 1 minute
    enabled: isConnected,
    initialData: mockProposals,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Fallback to hardcoded mock data if needed
  const proposalData = proposals || [
    {
      id: 42,
      title: "FirstStepAI Platform Enhancement Roadmap Q4",
      description: "Vote on the proposed feature development roadmap for Q4. Includes AI model improvements, web3 integrations, and community tools.",
      creatorId: 1,
      startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
      isActive: true,
      votesFor: 175,
      votesAgainst: 72,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 43,
      title: "Community Treasury Allocation for Developer Grants",
      description: "Proposal to allocate 5% of the community treasury for developer grants to build innovative applications on the FirstStepAI platform.",
      creatorId: 2,
      startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
      isActive: true,
      votesFor: 163,
      votesAgainst: 20,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  return {
    proposals: proposalData,
    isLoading,
    error: error ? "Failed to load proposals. Please try again later." : null,
    refetch,
  };
}
