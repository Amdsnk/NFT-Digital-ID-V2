import { Badge, ContributionCategory, FlameLog, Nft, Proposal, Vote } from '@/shared/schema';

// Mock NFT data
export const mockNfts: Nft[] = [
  {
    id: 1,
    tokenId: 'FSAI00001',
    userId: 1,
    metadata: {
      name: 'Soul ID #FSAI00001',
      description: 'A non-transferable identity NFT for the FirstStepAI ecosystem',
      image: 'https://via.placeholder.com/500',
      attributes: [
        { trait_type: 'Level', value: 3 },
        { trait_type: 'Trust Score', value: 850 },
        { trait_type: 'Creation Date', value: '2024-01-15T00:00:00Z' }
      ]
    },
    network: 'Polygon Mumbai',
    isActive: true,
    mintedAt: new Date('2024-01-15').toISOString()
  }
];

// Mock badge data
export const mockBadges: Badge[] = [
  {
    id: 1,
    name: 'Early Adopter',
    description: 'One of the first to join FirstStepAI',
    icon: '🌟',
    requiredPoints: 0,
    category: 'achievement'
  },
  {
    id: 2,
    name: 'Contributor',
    description: 'Made valuable contributions to the ecosystem',
    icon: '🏆',
    requiredPoints: 100,
    category: 'contribution'
  },
  {
    id: 3,
    name: 'Innovator',
    description: 'Proposed innovative solutions',
    icon: '💡',
    requiredPoints: 250,
    category: 'innovation'
  }
];

// Mock contribution categories
export const mockCategories: ContributionCategory[] = [
  {
    id: 1,
    name: 'Code Contribution',
    description: 'Contributing code to FirstStepAI projects',
    pointValue: 50
  },
  {
    id: 2,
    name: 'Community Support',
    description: 'Helping other community members',
    pointValue: 20
  },
  {
    id: 3,
    name: 'Content Creation',
    description: 'Creating educational content',
    pointValue: 30
  }
];

// Mock flame log entries
export const mockFlameLogs: FlameLog[] = [
  {
    id: 1,
    userId: 1,
    categoryId: 1,
    title: 'Bug Fix Contribution',
    description: 'Fixed critical bug in core module',
    pointsEarned: 50,
    createdAt: new Date('2024-01-20').toISOString()
  },
  {
    id: 2,
    userId: 1,
    categoryId: 2,
    title: 'Community Help',
    description: 'Helped new developers with setup',
    pointsEarned: 20,
    createdAt: new Date('2024-01-22').toISOString()
  }
];

// Mock proposals
export const mockProposals: Proposal[] = [
  {
    id: 1,
    title: 'Implement New Reward System',
    description: 'Proposal to implement a tiered reward system for contributors',
    creatorId: 1,
    startDate: new Date('2024-01-15').toISOString(),
    endDate: new Date('2024-02-15').toISOString(),
    isActive: true,
    votesFor: 15,
    votesAgainst: 5,
    createdAt: new Date('2024-01-15').toISOString()
  },
  {
    id: 2,
    title: 'Community Events Program',
    description: 'Monthly virtual meetups for knowledge sharing',
    creatorId: 2,
    startDate: new Date('2024-01-20').toISOString(),
    endDate: new Date('2024-02-20').toISOString(),
    isActive: true,
    votesFor: 25,
    votesAgainst: 3,
    createdAt: new Date('2024-01-20').toISOString()
  }
];

// Mock votes
export const mockVotes: Vote[] = [
  {
    id: 1,
    proposalId: 1,
    userId: 1,
    voteType: true,
    votedAt: new Date('2024-01-16').toISOString()
  },
  {
    id: 2,
    proposalId: 1,
    userId: 2,
    voteType: false,
    votedAt: new Date('2024-01-17').toISOString()
  }
];