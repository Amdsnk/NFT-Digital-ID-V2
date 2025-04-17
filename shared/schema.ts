import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  walletAddress: text("wallet_address").notNull().unique(),
  email: text("email"),
  trustScore: integer("trust_score").default(0).notNull(),
  trustLevel: integer("trust_level").default(1).notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// NFT model
export const nfts = pgTable("nfts", {
  id: serial("id").primaryKey(),
  tokenId: text("token_id").notNull().unique(),
  userId: integer("user_id").notNull().references(() => users.id),
  metadata: jsonb("metadata").notNull(),
  network: text("network").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  mintedAt: timestamp("minted_at").defaultNow().notNull(),
});

// Badge model
export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  requiredPoints: integer("required_points").notNull(),
  category: text("category").notNull(),
});

// User badges
export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  badgeId: integer("badge_id").notNull().references(() => badges.id),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
});

// Contribution categories
export const contributionCategories = pgTable("contribution_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  pointValue: integer("point_value").notNull(),
});

// Flame log (contributions)
export const flameLog = pgTable("flame_log", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  categoryId: integer("category_id").notNull().references(() => contributionCategories.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  pointsEarned: integer("points_earned").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Proposals for DAO voting
export const proposals = pgTable("proposals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  creatorId: integer("creator_id").notNull().references(() => users.id),
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  votesFor: integer("votes_for").default(0).notNull(),
  votesAgainst: integer("votes_against").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Votes on proposals
export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  proposalId: integer("proposal_id").notNull().references(() => proposals.id),
  userId: integer("user_id").notNull().references(() => users.id),
  voteType: boolean("vote_type").notNull(), // true = for, false = against
  votedAt: timestamp("voted_at").defaultNow().notNull(),
});

// NFT Transfer requests
export const transferRequests = pgTable("transfer_requests", {
  id: serial("id").primaryKey(),
  nftId: integer("nft_id").notNull().references(() => nfts.id),
  fromUserId: integer("from_user_id").notNull().references(() => users.id),
  toWalletAddress: text("to_wallet_address").notNull(),
  reason: text("reason").notNull(),
  status: text("status").default("pending").notNull(), // pending, approved, rejected
  reviewedBy: integer("reviewed_by").references(() => users.id),
  requestedAt: timestamp("requested_at").defaultNow().notNull(),
  reviewedAt: timestamp("reviewed_at"),
});

// Create insert schemas for each model
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  createdAt: true 
});

export const insertNftSchema = createInsertSchema(nfts).omit({ 
  id: true, 
  mintedAt: true 
});

export const insertBadgeSchema = createInsertSchema(badges).omit({ 
  id: true 
});

export const insertUserBadgeSchema = createInsertSchema(userBadges).omit({ 
  id: true, 
  earnedAt: true 
});

export const insertContributionCategorySchema = createInsertSchema(contributionCategories).omit({ 
  id: true 
});

export const insertFlameLogSchema = createInsertSchema(flameLog).omit({ 
  id: true, 
  createdAt: true 
});

export const insertProposalSchema = createInsertSchema(proposals).omit({ 
  id: true, 
  votesFor: true, 
  votesAgainst: true, 
  createdAt: true 
});

export const insertVoteSchema = createInsertSchema(votes).omit({ 
  id: true, 
  votedAt: true 
});

export const insertTransferRequestSchema = createInsertSchema(transferRequests).omit({ 
  id: true, 
  status: true, 
  reviewedBy: true, 
  requestedAt: true, 
  reviewedAt: true 
});

// Define types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertNft = z.infer<typeof insertNftSchema>;
export type Nft = typeof nfts.$inferSelect;

export type InsertBadge = z.infer<typeof insertBadgeSchema>;
export type Badge = typeof badges.$inferSelect;

export type InsertUserBadge = z.infer<typeof insertUserBadgeSchema>;
export type UserBadge = typeof userBadges.$inferSelect;

export type InsertContributionCategory = z.infer<typeof insertContributionCategorySchema>;
export type ContributionCategory = typeof contributionCategories.$inferSelect;

export type InsertFlameLog = z.infer<typeof insertFlameLogSchema>;
export type FlameLog = typeof flameLog.$inferSelect;

export type InsertProposal = z.infer<typeof insertProposalSchema>;
export type Proposal = typeof proposals.$inferSelect;

export type InsertVote = z.infer<typeof insertVoteSchema>;
export type Vote = typeof votes.$inferSelect;

export type InsertTransferRequest = z.infer<typeof insertTransferRequestSchema>;
export type TransferRequest = typeof transferRequests.$inferSelect;
