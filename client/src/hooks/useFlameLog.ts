import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

// Updated interface to match what FlameLogPage expects
export interface FlameLogEntry {
  id: string;
  author: {
    username: string;
    walletAddress: string;
    trustLevel: number;
  };
  content: string;
  category: string;
  timestamp: string;
  likes: number;
  comments: Array<{
    id: string;
    author: string;
    content: string;
    timestamp: string;
  }>;
  verified: boolean;
}

interface NewFlameLogEntry {
  content: string;
  category: string;
  author: {
    username: string;
    walletAddress: string;
    trustLevel: number;
  };
}

interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  startItem: number;
  endItem: number;
}

export function useFlameLog() {
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
    startItem: 0,
    endItem: 0,
  });

  // Sample data for demonstration - updated to match the expected structure
  const dummyFlameLog: FlameLogEntry[] = [
    {
      id: "1",
      author: {
        username: "alex_web3",
        walletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        trustLevel: 4
      },
      content: "Just completed a new integration with the FirstStepAI API. Check out my project in the showcase section!",
      category: "contribution",
      timestamp: new Date().toISOString(),
      likes: 15,
      comments: [
        {
          id: "c1",
          author: "crypto_sarah",
          content: "Great work! The UI looks amazing.",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        }
      ],
      verified: true
    },
    {
      id: "2",
      author: {
        username: "blockchain_dev",
        walletAddress: "0x3A4e27b5B3A5A2Cc98843De9F2848974C1c05ecB",
        trustLevel: 3
      },
      content: "I've submitted my vote on DAO Proposal #42. Important changes to the governance structure - make sure to review and vote!",
      category: "update",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      likes: 8,
      comments: [],
      verified: true
    },
    {
      id: "3",
      author: {
        username: "crypto_sarah",
        walletAddress: "0x9D7f74d0C41E726EC95884E0e97Fa6129e3b5E99",
        trustLevel: 5
      },
      content: "Hosting a workshop on NFT identity systems next Friday. Join us to learn about the latest developments in Web3 identity!",
      category: "event",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 23,
      comments: [
        {
          id: "c2",
          author: "alex_web3",
          content: "Looking forward to it! Will there be a recording?",
          timestamp: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "c3",
          author: "blockchain_dev",
          content: "Count me in!",
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        }
      ],
      verified: false
    }
  ];

  // Mock mutation for adding new entries
  const addEntry = useMutation({
    mutationFn: async (newEntry: FlameLogEntry) => {
      // In a real app, this would be an API call
      // return apiRequest("POST", "/api/flame-log", newEntry);
      
      // For demo, just return the entry as is
      return newEntry;
    },
    onSuccess: () => {
      // In a real app, we would invalidate the query to refetch data
      queryClient.invalidateQueries({ queryKey: ['/api/users/flame-log'] });
    }
  });

  return {
    flameLog: dummyFlameLog,
    isLoading: false,
    error: null,
    pagination,
    setPagination,
    addEntry: (entry: FlameLogEntry) => addEntry.mutate(entry),
    refetch: () => {}, // Empty function since we're using dummy data
  };
}
