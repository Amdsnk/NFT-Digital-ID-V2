import { Badge } from '@/shared/schema';
import { useQuery } from '@tanstack/react-query';
import { useWeb3 } from './useWeb3';

// Enhanced badge data with visual properties
export const enhancedMockBadges: Badge[] = [
  {
    id: 1,
    name: 'Early Adopter',
    description: 'One of the first to join FirstStepAI',
    icon: 'fa-rocket',
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    requiredPoints: 0,
    category: 'achievement'
  },
  {
    id: 2,
    name: 'Contributor',
    description: 'Made valuable contributions to the ecosystem',
    icon: 'fa-trophy',
    color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    requiredPoints: 100,
    category: 'contribution'
  },
  {
    id: 3,
    name: 'Innovator',
    description: 'Proposed innovative solutions',
    icon: 'fa-lightbulb',
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    requiredPoints: 250,
    category: 'innovation'
  },
  {
    id: 4,
    name: 'Community Leader',
    description: 'Demonstrated leadership in the community',
    icon: 'fa-users',
    color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    requiredPoints: 500,
    category: 'leadership'
  },
  {
    id: 5,
    name: 'Governance Expert',
    description: 'Active participation in DAO governance',
    icon: 'fa-landmark',
    color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
    requiredPoints: 350,
    category: 'governance'
  }
];

export function useBadges() {
  const { address, isConnected } = useWeb3();

  const {
    data: badges,
    isLoading,
    error,
    refetch,
  } = useQuery<Badge[]>({
    queryKey: ['badges'],
    enabled: isConnected && !!address,
    staleTime: 300 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    initialData: enhancedMockBadges, // Use enhanced mock data as initial data
  });

  return {
    badges,
    isLoading,
    error,
    refetch,
  };
}
