import { useQuery } from "@tanstack/react-query";
import { useWeb3 } from "./useWeb3";

interface TrustScoreData {
  score: number;
  level: number;
  weeklyChange: number;
  contributionPoints: number;
  communityUpvotes: number;
  governanceParticipation: number;
  accountAgeBonus: number;
  contributionBreakdown: {
    category: string;
    points: number;
  }[];
}

export function useTrustScore() {
  const { address, isConnected } = useWeb3();

  // Since we're in demo mode, we'll always return the mock data without even making an API call
  // This eliminates any potential errors from the API
  const fallbackData: TrustScoreData = {
    score: 72,
    level: 3,
    weeklyChange: 5,
    contributionPoints: 45,
    communityUpvotes: 12,
    governanceParticipation: 8,
    accountAgeBonus: 7,
    contributionBreakdown: [
      { category: "Forum Contributions", points: 18 },
      { category: "Community Events", points: 12 },
      { category: "Content Creation", points: 15 },
      { category: "Governance Participation", points: 8 },
      { category: "Account Age", points: 7 },
      { category: "Badge Bonuses", points: 12 },
    ],
  };

  // For a real app, we would use the following code instead:
  // const { data: trustScore, isLoading, error } = useQuery<TrustScoreData>({
  //   queryKey: ["/api/users/trust-score"],
  //   enabled: isConnected && !!address,
  //   staleTime: 60 * 1000,
  //   retry: 1,
  // });
  // const data = trustScore || fallbackData;
  
  return {
    trustScore: fallbackData,
    isLoading: false,
    error: null,
    contributionBreakdown: fallbackData.contributionBreakdown,
  };
}
