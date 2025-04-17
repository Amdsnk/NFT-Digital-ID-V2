import { 
  users, type User, type InsertUser,
  nfts, type Nft, type InsertNft,
  badges, type Badge, type InsertBadge,
  userBadges, type UserBadge, type InsertUserBadge,
  contributionCategories, type ContributionCategory, type InsertContributionCategory,
  flameLog, type FlameLog, type InsertFlameLog,
  proposals, type Proposal, type InsertProposal,
  votes, type Vote, type InsertVote,
  transferRequests, type TransferRequest, type InsertTransferRequest
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { checkDbConnection } from "./db";

export interface IStorage {
  // Database health check
  ping(): Promise<boolean>;
  
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByWalletAddress(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;
  updateUserTrustScore(userId: number, newScore: number): Promise<User | undefined>;
  
  // NFT operations
  getNft(id: number): Promise<Nft | undefined>;
  getNftByTokenId(tokenId: string): Promise<Nft | undefined>;
  getNftByUserId(userId: number): Promise<Nft | undefined>;
  createNft(nft: InsertNft): Promise<Nft>;
  updateNft(id: number, data: Partial<Nft>): Promise<Nft | undefined>;
  
  // Badge operations
  getAllBadges(): Promise<Badge[]>;
  getBadge(id: number): Promise<Badge | undefined>;
  createBadge(badge: InsertBadge): Promise<Badge>;
  getUserBadges(userId: number): Promise<(Badge & { earnedAt: Date })[]>;
  assignBadgeToUser(userBadge: InsertUserBadge): Promise<UserBadge>;
  
  // Contribution categories
  getAllContributionCategories(): Promise<ContributionCategory[]>;
  getContributionCategory(id: number): Promise<ContributionCategory | undefined>;
  createContributionCategory(category: InsertContributionCategory): Promise<ContributionCategory>;
  
  // Flame Log operations
  getFlameLog(userId: number, limit?: number): Promise<(FlameLog & { category: ContributionCategory })[]>;
  createFlameLogEntry(entry: InsertFlameLog): Promise<FlameLog>;
  
  // Proposal operations
  getAllProposals(activeOnly?: boolean): Promise<Proposal[]>;
  getProposal(id: number): Promise<Proposal | undefined>;
  createProposal(proposal: InsertProposal): Promise<Proposal>;
  updateProposal(id: number, data: Partial<Proposal>): Promise<Proposal | undefined>;
  
  // Vote operations
  getVotesByProposal(proposalId: number): Promise<Vote[]>;
  getVoteByUserAndProposal(userId: number, proposalId: number): Promise<Vote | undefined>;
  createVote(vote: InsertVote): Promise<Vote>;
  
  // Transfer request operations
  getAllTransferRequests(status?: string): Promise<(TransferRequest & { nft: Nft, requester: User })[]>;
  getTransferRequest(id: number): Promise<TransferRequest | undefined>;
  createTransferRequest(request: InsertTransferRequest): Promise<TransferRequest>;
  updateTransferRequestStatus(id: number, status: string, reviewedBy: number): Promise<TransferRequest | undefined>;
  
  // Admin operations
  getAllUsers(): Promise<User[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private nfts: Map<number, Nft>;
  private badges: Map<number, Badge>;
  private userBadges: Map<number, UserBadge>;
  private contributionCategories: Map<number, ContributionCategory>;
  private flameLog: Map<number, FlameLog>;
  private proposals: Map<number, Proposal>;
  private votes: Map<number, Vote>;
  private transferRequests: Map<number, TransferRequest>;
  
  private userIdCounter: number;
  private nftIdCounter: number;
  private badgeIdCounter: number;
  private userBadgeIdCounter: number;
  private categoryIdCounter: number;
  private flameLogIdCounter: number;
  private proposalIdCounter: number;
  private voteIdCounter: number;
  private transferRequestIdCounter: number;

  constructor() {
    this.users = new Map();
    this.nfts = new Map();
    this.badges = new Map();
    this.userBadges = new Map();
    this.contributionCategories = new Map();
    this.flameLog = new Map();
    this.proposals = new Map();
    this.votes = new Map();
    this.transferRequests = new Map();
    
    this.userIdCounter = 1;
    this.nftIdCounter = 1;
    this.badgeIdCounter = 1;
    this.userBadgeIdCounter = 1;
    this.categoryIdCounter = 1;
    this.flameLogIdCounter = 1;
    this.proposalIdCounter = 1;
    this.voteIdCounter = 1;
    this.transferRequestIdCounter = 1;
    
    // Initialize with some sample data
    this.initSampleData();
  }

  // Initialize sample data
  private initSampleData() {
    // Create default contribution categories
    const categories = [
      { name: "Forum Contributions", description: "Contributions to community forums and discussions", pointValue: 15 },
      { name: "Community Events", description: "Participation in community events", pointValue: 25 },
      { name: "Content Creation", description: "Creating content for the community", pointValue: 30 },
      { name: "Governance Participation", description: "Participating in governance voting", pointValue: 10 },
      { name: "Project Submission", description: "Submitting projects built with FirstStepAI", pointValue: 50 }
    ];
    
    categories.forEach(cat => {
      this.createContributionCategory({
        name: cat.name,
        description: cat.description,
        pointValue: cat.pointValue
      });
    });
    
    // Create default badges
    const defaultBadges = [
      { name: "Early Adopter", description: "One of the first users to join", icon: "seedling", requiredPoints: 50, category: "general" },
      { name: "Top Contributor", description: "Consistently contributes to the community", icon: "comments", requiredPoints: 300, category: "contribution" },
      { name: "Governance", description: "Active participant in governance decisions", icon: "vote-yea", requiredPoints: 75, category: "governance" },
      { name: "Innovator", description: "Created innovative solutions with FirstStepAI", icon: "lightbulb", requiredPoints: 200, category: "technical" },
      { name: "Flame 100", description: "Earned 100+ points in a single week", icon: "fire", requiredPoints: 100, category: "achievement" },
      { name: "Community Builder", description: "Helped grow and strengthen the community", icon: "users", requiredPoints: 500, category: "contribution" },
      { name: "Tech Visionary", description: "Provided technical direction for the community", icon: "microchip", requiredPoints: 400, category: "technical" }
    ];
    
    defaultBadges.forEach(badge => {
      this.createBadge({
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        requiredPoints: badge.requiredPoints,
        category: badge.category
      });
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.walletAddress.toLowerCase() === walletAddress.toLowerCase()) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const newUser: User = { ...user, id, createdAt: new Date() };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateUserTrustScore(userId: number, newScore: number): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    // Calculate trust level based on score
    const trustLevel = Math.floor(newScore / 200) + 1;
    
    const updatedUser: User = { 
      ...user, 
      trustScore: newScore,
      trustLevel: trustLevel 
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // NFT operations
  async getNft(id: number): Promise<Nft | undefined> {
    return this.nfts.get(id);
  }

  async getNftByTokenId(tokenId: string): Promise<Nft | undefined> {
    for (const nft of this.nfts.values()) {
      if (nft.tokenId === tokenId) {
        return nft;
      }
    }
    return undefined;
  }

  async getNftByUserId(userId: number): Promise<Nft | undefined> {
    for (const nft of this.nfts.values()) {
      if (nft.userId === userId) {
        return nft;
      }
    }
    return undefined;
  }

  async createNft(nft: InsertNft): Promise<Nft> {
    const id = this.nftIdCounter++;
    const newNft: Nft = { ...nft, id, mintedAt: new Date() };
    this.nfts.set(id, newNft);
    return newNft;
  }

  async updateNft(id: number, data: Partial<Nft>): Promise<Nft | undefined> {
    const nft = await this.getNft(id);
    if (!nft) return undefined;
    
    const updatedNft: Nft = { ...nft, ...data };
    this.nfts.set(id, updatedNft);
    return updatedNft;
  }

  // Badge operations
  async getAllBadges(): Promise<Badge[]> {
    return Array.from(this.badges.values());
  }

  async getBadge(id: number): Promise<Badge | undefined> {
    return this.badges.get(id);
  }

  async createBadge(badge: InsertBadge): Promise<Badge> {
    const id = this.badgeIdCounter++;
    const newBadge: Badge = { ...badge, id };
    this.badges.set(id, newBadge);
    return newBadge;
  }

  async getUserBadges(userId: number): Promise<(Badge & { earnedAt: Date })[]> {
    const userBadgeList: UserBadge[] = [];
    
    // Find all badges for this user
    for (const userBadge of this.userBadges.values()) {
      if (userBadge.userId === userId) {
        userBadgeList.push(userBadge);
      }
    }
    
    // Return full badge details with earned date
    return userBadgeList.map(ub => {
      const badge = this.badges.get(ub.badgeId);
      if (!badge) throw new Error(`Badge ID ${ub.badgeId} not found`);
      return { ...badge, earnedAt: ub.earnedAt };
    });
  }

  async assignBadgeToUser(userBadge: InsertUserBadge): Promise<UserBadge> {
    const id = this.userBadgeIdCounter++;
    const newUserBadge: UserBadge = { ...userBadge, id, earnedAt: new Date() };
    this.userBadges.set(id, newUserBadge);
    return newUserBadge;
  }

  // Contribution category operations
  async getAllContributionCategories(): Promise<ContributionCategory[]> {
    return Array.from(this.contributionCategories.values());
  }

  async getContributionCategory(id: number): Promise<ContributionCategory | undefined> {
    return this.contributionCategories.get(id);
  }

  async createContributionCategory(category: InsertContributionCategory): Promise<ContributionCategory> {
    const id = this.categoryIdCounter++;
    const newCategory: ContributionCategory = { ...category, id };
    this.contributionCategories.set(id, newCategory);
    return newCategory;
  }

  // Flame Log operations
  async getFlameLog(userId: number, limit?: number): Promise<(FlameLog & { category: ContributionCategory })[]> {
    const entries: FlameLog[] = [];
    
    // Get all flame log entries for this user
    for (const entry of this.flameLog.values()) {
      if (entry.userId === userId) {
        entries.push(entry);
      }
    }
    
    // Sort by date (newest first)
    entries.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    // Apply limit if specified
    const limitedEntries = limit ? entries.slice(0, limit) : entries;
    
    // Attach category details
    return limitedEntries.map(entry => {
      const category = this.contributionCategories.get(entry.categoryId);
      if (!category) throw new Error(`Category ID ${entry.categoryId} not found`);
      return { ...entry, category };
    });
  }

  async createFlameLogEntry(entry: InsertFlameLog): Promise<FlameLog> {
    const id = this.flameLogIdCounter++;
    const newEntry: FlameLog = { ...entry, id, createdAt: new Date() };
    this.flameLog.set(id, newEntry);
    
    // Update user's trust score
    const user = await this.getUser(entry.userId);
    if (user) {
      const newScore = user.trustScore + entry.pointsEarned;
      await this.updateUserTrustScore(user.id, newScore);
    }
    
    return newEntry;
  }

  // Proposal operations
  async getAllProposals(activeOnly: boolean = false): Promise<Proposal[]> {
    let proposals = Array.from(this.proposals.values());
    
    if (activeOnly) {
      const now = new Date();
      proposals = proposals.filter(p => 
        p.isActive && p.startDate <= now && p.endDate >= now
      );
    }
    
    // Sort by date (newest first)
    return proposals.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getProposal(id: number): Promise<Proposal | undefined> {
    return this.proposals.get(id);
  }

  async createProposal(proposal: InsertProposal): Promise<Proposal> {
    const id = this.proposalIdCounter++;
    const newProposal: Proposal = { 
      ...proposal, 
      id, 
      votesFor: 0, 
      votesAgainst: 0, 
      createdAt: new Date() 
    };
    this.proposals.set(id, newProposal);
    return newProposal;
  }

  async updateProposal(id: number, data: Partial<Proposal>): Promise<Proposal | undefined> {
    const proposal = await this.getProposal(id);
    if (!proposal) return undefined;
    
    const updatedProposal: Proposal = { ...proposal, ...data };
    this.proposals.set(id, updatedProposal);
    return updatedProposal;
  }

  // Vote operations
  async getVotesByProposal(proposalId: number): Promise<Vote[]> {
    const votes: Vote[] = [];
    
    for (const vote of this.votes.values()) {
      if (vote.proposalId === proposalId) {
        votes.push(vote);
      }
    }
    
    return votes;
  }

  async getVoteByUserAndProposal(userId: number, proposalId: number): Promise<Vote | undefined> {
    for (const vote of this.votes.values()) {
      if (vote.userId === userId && vote.proposalId === proposalId) {
        return vote;
      }
    }
    return undefined;
  }

  async createVote(vote: InsertVote): Promise<Vote> {
    // Check if user already voted on this proposal
    const existingVote = await this.getVoteByUserAndProposal(vote.userId, vote.proposalId);
    if (existingVote) {
      throw new Error("User has already voted on this proposal");
    }
    
    const id = this.voteIdCounter++;
    const newVote: Vote = { ...vote, id, votedAt: new Date() };
    this.votes.set(id, newVote);
    
    // Update proposal vote count
    const proposal = await this.getProposal(vote.proposalId);
    if (proposal) {
      const updates = vote.voteType 
        ? { votesFor: proposal.votesFor + 1 }
        : { votesAgainst: proposal.votesAgainst + 1 };
      
      await this.updateProposal(proposal.id, updates);
    }
    
    return newVote;
  }

  // Transfer request operations
  async getAllTransferRequests(status?: string): Promise<(TransferRequest & { nft: Nft, requester: User })[]> {
    let requests = Array.from(this.transferRequests.values());
    
    if (status) {
      requests = requests.filter(r => r.status === status);
    }
    
    // Sort by date (newest first)
    requests.sort((a, b) => b.requestedAt.getTime() - a.requestedAt.getTime());
    
    // Attach NFT and user details
    return requests.map(req => {
      const nft = this.nfts.get(req.nftId);
      const requester = this.users.get(req.fromUserId);
      
      if (!nft) throw new Error(`NFT ID ${req.nftId} not found`);
      if (!requester) throw new Error(`User ID ${req.fromUserId} not found`);
      
      return { ...req, nft, requester };
    });
  }

  async getTransferRequest(id: number): Promise<TransferRequest | undefined> {
    return this.transferRequests.get(id);
  }

  async createTransferRequest(request: InsertTransferRequest): Promise<TransferRequest> {
    const id = this.transferRequestIdCounter++;
    const newRequest: TransferRequest = { 
      ...request, 
      id, 
      status: "pending", 
      requestedAt: new Date(),
      reviewedAt: undefined,
      reviewedBy: undefined
    };
    this.transferRequests.set(id, newRequest);
    return newRequest;
  }

  async updateTransferRequestStatus(id: number, status: string, reviewedBy: number): Promise<TransferRequest | undefined> {
    const request = await this.getTransferRequest(id);
    if (!request) return undefined;
    
    const updatedRequest: TransferRequest = { 
      ...request, 
      status, 
      reviewedBy, 
      reviewedAt: new Date() 
    };
    
    this.transferRequests.set(id, updatedRequest);
    
    // If approved, update the NFT owner
    if (status === "approved") {
      const nft = await this.getNft(request.nftId);
      if (nft) {
        // This would actually involve creating a new user with the wallet address
        // and transferring the NFT, but for the demo we'll just deactivate it
        await this.updateNft(nft.id, { isActive: false });
      }
    }
    
    return updatedRequest;
  }

  // Database health check
  async ping(): Promise<boolean> {
    // Memory storage is always available
    return true;
  }
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.walletAddress, walletAddress));
    return user;
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }
  
  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const result = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    
    return result[0];
  }
  
  async updateUserTrustScore(userId: number, newScore: number): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ trustScore: newScore, trustLevel: Math.floor(newScore / 20) + 1 })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }
  
  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }
  
  // NFT operations
  async getNft(id: number): Promise<Nft | undefined> {
    const [nft] = await db.select().from(nfts).where(eq(nfts.id, id));
    return nft;
  }
  
  async getNftByTokenId(tokenId: string): Promise<Nft | undefined> {
    const [nft] = await db.select().from(nfts).where(eq(nfts.tokenId, tokenId));
    return nft;
  }
  
  async getNftByUserId(userId: number): Promise<Nft | undefined> {
    const [nft] = await db.select().from(nfts).where(eq(nfts.userId, userId));
    return nft;
  }
  
  async createNft(nft: InsertNft): Promise<Nft> {
    const [newNft] = await db.insert(nfts).values(nft).returning();
    return newNft;
  }
  
  async updateNft(id: number, data: Partial<Nft>): Promise<Nft | undefined> {
    const [updatedNft] = await db
      .update(nfts)
      .set(data)
      .where(eq(nfts.id, id))
      .returning();
    return updatedNft;
  }
  
  // Badge operations
  async getAllBadges(): Promise<Badge[]> {
    return db.select().from(badges);
  }
  
  async getBadge(id: number): Promise<Badge | undefined> {
    const [badge] = await db.select().from(badges).where(eq(badges.id, id));
    return badge;
  }
  
  async createBadge(badge: InsertBadge): Promise<Badge> {
    const [newBadge] = await db.insert(badges).values(badge).returning();
    return newBadge;
  }
  
  async getUserBadges(userId: number): Promise<(Badge & { earnedAt: Date })[]> {
    const results = await db
      .select({
        badge: badges,
        earnedAt: userBadges.earnedAt
      })
      .from(userBadges)
      .innerJoin(badges, eq(badges.id, userBadges.badgeId))
      .where(eq(userBadges.userId, userId));
    
    return results.map(r => ({ ...r.badge, earnedAt: r.earnedAt }));
  }
  
  async assignBadgeToUser(userBadge: InsertUserBadge): Promise<UserBadge> {
    const [newUserBadge] = await db.insert(userBadges).values(userBadge).returning();
    return newUserBadge;
  }
  
  // Contribution categories
  async getAllContributionCategories(): Promise<ContributionCategory[]> {
    return db.select().from(contributionCategories);
  }
  
  async getContributionCategory(id: number): Promise<ContributionCategory | undefined> {
    const [category] = await db
      .select()
      .from(contributionCategories)
      .where(eq(contributionCategories.id, id));
    return category;
  }
  
  async createContributionCategory(category: InsertContributionCategory): Promise<ContributionCategory> {
    const [newCategory] = await db
      .insert(contributionCategories)
      .values(category)
      .returning();
    return newCategory;
  }
  
  // Flame Log operations
  async getFlameLog(userId: number, limit?: number): Promise<(FlameLog & { category: ContributionCategory })[]> {
    let query = db
      .select({
        log: flameLog,
        category: contributionCategories
      })
      .from(flameLog)
      .innerJoin(contributionCategories, eq(contributionCategories.id, flameLog.categoryId))
      .where(eq(flameLog.userId, userId))
      .orderBy(desc(flameLog.createdAt));
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const results = await query;
    return results.map(r => ({ ...r.log, category: r.category }));
  }
  
  async createFlameLogEntry(entry: InsertFlameLog): Promise<FlameLog> {
    const [newEntry] = await db.insert(flameLog).values(entry).returning();
    return newEntry;
  }
  
  // Proposal operations
  async getAllProposals(activeOnly: boolean = false): Promise<Proposal[]> {
    let query = db.select().from(proposals);
    
    if (activeOnly) {
      query = query.where(eq(proposals.isActive, true));
    }
    
    return query;
  }
  
  async getProposal(id: number): Promise<Proposal | undefined> {
    const [proposal] = await db.select().from(proposals).where(eq(proposals.id, id));
    return proposal;
  }
  
  async createProposal(proposal: InsertProposal): Promise<Proposal> {
    const [newProposal] = await db.insert(proposals).values(proposal).returning();
    return newProposal;
  }
  
  async updateProposal(id: number, data: Partial<Proposal>): Promise<Proposal | undefined> {
    const [updatedProposal] = await db
      .update(proposals)
      .set(data)
      .where(eq(proposals.id, id))
      .returning();
    return updatedProposal;
  }
  
  // Vote operations
  async getVotesByProposal(proposalId: number): Promise<Vote[]> {
    return db.select().from(votes).where(eq(votes.proposalId, proposalId));
  }
  
  async getVoteByUserAndProposal(userId: number, proposalId: number): Promise<Vote | undefined> {
    const [vote] = await db
      .select()
      .from(votes)
      .where(and(eq(votes.userId, userId), eq(votes.proposalId, proposalId)));
    return vote;
  }
  
  async createVote(vote: InsertVote): Promise<Vote> {
    const [newVote] = await db.insert(votes).values(vote).returning();
    return newVote;
  }
  
  // Transfer request operations
  async getAllTransferRequests(status?: string): Promise<(TransferRequest & { nft: Nft, requester: User })[]> {
    let query = db
      .select({
        request: transferRequests,
        nft: nfts,
        requester: users
      })
      .from(transferRequests)
      .innerJoin(nfts, eq(nfts.id, transferRequests.nftId))
      .innerJoin(users, eq(users.id, transferRequests.fromUserId));
    
    if (status) {
      query = query.where(eq(transferRequests.status, status));
    }
    
    const results = await query;
    return results.map(r => ({ ...r.request, nft: r.nft, requester: r.requester }));
  }
  
  async getTransferRequest(id: number): Promise<TransferRequest | undefined> {
    const [request] = await db
      .select()
      .from(transferRequests)
      .where(eq(transferRequests.id, id));
    return request;
  }
  
  async createTransferRequest(request: InsertTransferRequest): Promise<TransferRequest> {
    const [newRequest] = await db
      .insert(transferRequests)
      .values(request)
      .returning();
    return newRequest;
  }
  
  async updateTransferRequestStatus(id: number, status: string, reviewedBy: number): Promise<TransferRequest | undefined> {
    const [updatedRequest] = await db
      .update(transferRequests)
      .set({
        status,
        reviewedBy,
        reviewedAt: new Date()
      })
      .where(eq(transferRequests.id, id))
      .returning();
    return updatedRequest;
  }

  // Database health check
  async ping(): Promise<boolean> {
    try {
      // Use the specialized health check function
      return await checkDbConnection();
    } catch (error) {
      console.error("Database ping failed:", error);
      return false;
    }
  }
}

// During development, you can switch between MemStorage and DatabaseStorage
// For production, use DatabaseStorage
export const storage = new DatabaseStorage();
