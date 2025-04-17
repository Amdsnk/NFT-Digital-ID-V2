import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertNftSchema, 
  insertFlameLogSchema,
  insertProposalSchema,
  insertVoteSchema,
  insertTransferRequestSchema
} from "@shared/schema";
import { ZodError } from "zod";

// Authentication middleware
const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  // Check for auth header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Unauthorized - Missing or invalid token" });
  }

  const token = authHeader.split(' ')[1];
  try {
    // Simple validation (in production, use proper JWT validation)
    const [userId, isAdmin] = token.split('|');
    const user = await storage.getUser(parseInt(userId));
    
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    // Check if admin flag matches
    if (isAdmin === 'true' && !user.isAdmin) {
      return res.status(403).json({ message: "Forbidden - Admin access required" });
    }
    
    // Add user to request object
    (req as any).user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};

// Admin middleware
const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (!user || !user.isAdmin) {
    return res.status(403).json({ message: "Forbidden - Admin access required" });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Error handling middleware for Zod validation errors
  const handleZodError = (err: any, res: Response) => {
    if (err instanceof ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: err.errors 
      });
    }
    throw err;
  };

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { walletAddress, password } = req.body;
      
      if (!walletAddress || !password) {
        return res.status(400).json({ message: "Wallet address and password are required" });
      }
      
      const user = await storage.getUserByWalletAddress(walletAddress);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // In a real app, compare password hash
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Generate a simple token (in production, use JWT)
      const token = `${user.id}|${user.isAdmin}`;
      
      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          walletAddress: user.walletAddress,
          isAdmin: user.isAdmin,
          trustScore: user.trustScore,
          trustLevel: user.trustLevel
        }
      });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/auth/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      // Find user by username
      const users = await storage.getAllUsers();
      const user = users.find(u => u.username === username && u.isAdmin);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid admin credentials" });
      }
      
      // In a real app, compare password hash
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid admin credentials" });
      }
      
      // Generate a simple token (in production, use JWT)
      const token = `${user.id}|${user.isAdmin}`;
      
      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          walletAddress: user.walletAddress,
          isAdmin: user.isAdmin
        }
      });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // User routes
  app.get("/api/users/wallet/:address", async (req, res) => {
    try {
      const walletAddress = req.params.address;
      const user = await storage.getUserByWalletAddress(walletAddress);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByWalletAddress(userData.walletAddress);
      
      if (existingUser) {
        return res.status(409).json({ message: "User with this wallet address already exists" });
      }
      
      const newUser = await storage.createUser(userData);
      res.status(201).json(newUser);
    } catch (err) {
      if (err instanceof ZodError) {
        return handleZodError(err, res);
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // NFT routes
  app.get("/api/nfts/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const nft = await storage.getNftByUserId(userId);
      
      if (!nft) {
        return res.status(404).json({ message: "NFT not found for this user" });
      }
      
      res.json(nft);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/nfts", async (req, res) => {
    try {
      const nftData = insertNftSchema.parse(req.body);
      const newNft = await storage.createNft(nftData);
      res.status(201).json(newNft);
    } catch (err) {
      if (err instanceof ZodError) {
        return handleZodError(err, res);
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // Badge routes
  app.get("/api/badges", async (req, res) => {
    try {
      const badges = await storage.getAllBadges();
      res.json(badges);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/users/:userId/badges", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const badges = await storage.getUserBadges(userId);
      res.json(badges);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Contribution categories routes
  app.get("/api/contribution-categories", async (req, res) => {
    try {
      const categories = await storage.getAllContributionCategories();
      res.json(categories);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Flame log routes
  app.get("/api/users/:userId/flame-log", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      let limit: number | undefined = undefined;
      if (req.query.limit) {
        limit = parseInt(req.query.limit as string);
        if (isNaN(limit)) {
          return res.status(400).json({ message: "Invalid limit parameter" });
        }
      }
      
      const flameLog = await storage.getFlameLog(userId, limit);
      res.json(flameLog);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/flame-log", async (req, res) => {
    try {
      const logData = insertFlameLogSchema.parse(req.body);
      const newEntry = await storage.createFlameLogEntry(logData);
      res.status(201).json(newEntry);
    } catch (err) {
      if (err instanceof ZodError) {
        return handleZodError(err, res);
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // Proposal routes
  app.get("/api/proposals", async (req, res) => {
    try {
      const activeOnly = req.query.active === "true";
      const proposals = await storage.getAllProposals(activeOnly);
      res.json(proposals);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/proposals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid proposal ID" });
      }
      
      const proposal = await storage.getProposal(id);
      
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      
      res.json(proposal);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/proposals", async (req, res) => {
    try {
      const proposalData = insertProposalSchema.parse(req.body);
      const newProposal = await storage.createProposal(proposalData);
      res.status(201).json(newProposal);
    } catch (err) {
      if (err instanceof ZodError) {
        return handleZodError(err, res);
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // Vote routes
  app.post("/api/votes", async (req, res) => {
    try {
      const voteData = insertVoteSchema.parse(req.body);
      
      // Check if proposal exists and is active
      const proposal = await storage.getProposal(voteData.proposalId);
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      
      if (!proposal.isActive) {
        return res.status(400).json({ message: "Proposal is not active" });
      }
      
      const now = new Date();
      if (now < proposal.startDate || now > proposal.endDate) {
        return res.status(400).json({ message: "Proposal voting period is not active" });
      }
      
      try {
        const newVote = await storage.createVote(voteData);
        res.status(201).json(newVote);
      } catch (err: any) {
        if (err.message === "User has already voted on this proposal") {
          return res.status(409).json({ message: err.message });
        }
        throw err;
      }
    } catch (err) {
      if (err instanceof ZodError) {
        return handleZodError(err, res);
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // Transfer request routes
  app.get("/api/transfer-requests", async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const requests = await storage.getAllTransferRequests(status);
      res.json(requests);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/transfer-requests", async (req, res) => {
    try {
      const requestData = insertTransferRequestSchema.parse(req.body);
      
      // Verify the NFT exists and belongs to the user
      const nft = await storage.getNft(requestData.nftId);
      if (!nft) {
        return res.status(404).json({ message: "NFT not found" });
      }
      
      if (nft.userId !== requestData.fromUserId) {
        return res.status(403).json({ message: "This NFT does not belong to the specified user" });
      }
      
      const newRequest = await storage.createTransferRequest(requestData);
      res.status(201).json(newRequest);
    } catch (err) {
      if (err instanceof ZodError) {
        return handleZodError(err, res);
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.patch("/api/transfer-requests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid request ID" });
      }
      
      const { status, reviewedBy } = req.body;
      
      if (!status || typeof status !== "string") {
        return res.status(400).json({ message: "Status is required" });
      }
      
      if (!reviewedBy || typeof reviewedBy !== "number") {
        return res.status(400).json({ message: "ReviewedBy is required and must be a number" });
      }
      
      // Verify the request exists
      const request = await storage.getTransferRequest(id);
      if (!request) {
        return res.status(404).json({ message: "Transfer request not found" });
      }
      
      // Verify the reviewer is an admin (in a real app, check the logged-in user)
      const reviewer = await storage.getUser(reviewedBy);
      if (!reviewer || !reviewer.isAdmin) {
        return res.status(403).json({ message: "Only admins can approve/reject transfer requests" });
      }
      
      const updatedRequest = await storage.updateTransferRequestStatus(id, status, reviewedBy);
      res.json(updatedRequest);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Admin routes
  app.get("/api/admin/dashboard", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const userCount = users.length;
      
      const proposals = await storage.getAllProposals();
      const proposalCount = proposals.length;
      
      const transferRequests = await storage.getAllTransferRequests();
      const pendingRequests = transferRequests.filter(req => req.status === "pending").length;
      
      res.json({
        userCount,
        proposalCount,
        pendingTransferRequests: pendingRequests,
        recentUsers: users.slice(-5) // Last 5 users
      });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/admin/users", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/admin/users", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByWalletAddress(userData.walletAddress);
      
      if (existingUser) {
        return res.status(409).json({ message: "User with this wallet address already exists" });
      }
      
      const newUser = await storage.createUser(userData);
      res.status(201).json(newUser);
    } catch (err) {
      if (err instanceof ZodError) {
        return handleZodError(err, res);
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/admin/promote/:userId", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const updatedUser = await storage.updateUser(userId, { isAdmin: true });
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
