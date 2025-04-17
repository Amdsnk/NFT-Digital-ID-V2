import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useProposals } from "@/hooks/useProposals";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useWeb3 } from "@/hooks/useWeb3";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

type ProposalDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
};

function ProposalDetailsDialog({ isOpen, onClose, title, description }: ProposalDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400 mt-2">{description}</DialogDescription>
        </DialogHeader>
        <div className="border-t border-b border-slate-200 dark:border-slate-700 py-4 my-2">
          <h4 className="text-sm font-medium mb-2">Full Proposal Details</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            The complete proposal document includes technical specifications, implementation timelines, and resource allocation details. This proposal has been reviewed by the technical committee.
          </p>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function VotingProposals() {
  const { proposals, isLoading, error, refetch } = useProposals();
  const { address } = useWeb3();
  const { toast } = useToast();
  const [selectedProposal, setSelectedProposal] = useState<{
    id: number;
    title: string;
    description: string;
  } | null>(null);

  const handleVote = async (proposalId: number, voteType: boolean) => {
    if (!address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to vote on proposals",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiRequest("POST", "/api/votes", {
        proposalId,
        userId: 1, // In a real app, this would be derived from the connected wallet
        voteType,
      });

      toast({
        title: "Vote submitted",
        description: `Your vote has been recorded successfully!`,
      });

      // Refetch proposals to update the UI
      refetch();
    } catch (err) {
      console.error("Error voting:", err);
      toast({
        title: "Vote failed",
        description: "There was an error submitting your vote. You may have already voted on this proposal.",
        variant: "destructive",
      });
    }
  };

  const showProposalDetails = (proposal: {
    id: number;
    title: string;
    description: string;
  }) => {
    setSelectedProposal(proposal);
  };

  if (isLoading) {
    return (
      <div className="mt-8">
        <Skeleton className="h-7 w-32 mb-4" />
        <div className="bg-white dark:bg-gray-900 shadow overflow-hidden sm:rounded-md">
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700">
            <Skeleton className="h-5 w-40 mb-1" />
            <Skeleton className="h-4 w-64" />
          </div>
          <ul role="list" className="divide-y divide-slate-200 dark:divide-slate-700">
            {[...Array(2)].map((_, i) => (
              <li key={i} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-64" />
                  <Skeleton className="h-5 w-24 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-2 w-full mt-3 rounded-full" />
                <div className="mt-4 flex space-x-3">
                  <Skeleton className="h-8 w-20 rounded-full" />
                  <Skeleton className="h-8 w-24 rounded-full" />
                  <Skeleton className="h-8 w-24 rounded-full" />
                </div>
              </li>
            ))}
          </ul>
          <div className="px-6 py-4 flex justify-between border-t border-slate-200 dark:border-slate-700">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8">
        <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-4">DAO Voting</h2>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg p-4 text-red-600 dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

  const formatDateRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) {
      return `${diffDays} days`;
    } else if (diffDays === 1) {
      return "1 day";
    } else {
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      return `${diffHours} hours`;
    }
  };

  const calculatePercentage = (votes: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
  };

  const hasActiveProposals = proposals.length > 0;

  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-4">DAO Voting</h2>
      <div className="bg-white dark:bg-gray-900 shadow overflow-hidden sm:rounded-md">
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-base font-medium text-slate-900 dark:text-white">Active Proposals</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Cast your vote on community governance proposals</p>
        </div>

        {!hasActiveProposals ? (
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-vote-yea text-slate-400 dark:text-slate-500 text-2xl"></i>
            </div>
            <h3 className="text-base font-medium text-slate-900 dark:text-white mb-1">No active proposals</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
              There are currently no active governance proposals to vote on. Check back later or create a new proposal.
            </p>
            <Button size="sm">
              <i className="fas fa-plus mr-1"></i> Create Proposal
            </Button>
          </div>
        ) : (
          <>
            <ul role="list" className="divide-y divide-slate-200 dark:divide-slate-700">
              {proposals.map((proposal) => {
                const totalVotes = proposal.votesFor + proposal.votesAgainst;
                const forPercentage = calculatePercentage(proposal.votesFor, totalVotes);
                const againstPercentage = calculatePercentage(proposal.votesAgainst, totalVotes);
                
                return (
                  <li key={proposal.id}>
                    <div className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                          {proposal.title}
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300">
                            <i className="fas fa-clock mr-1 text-xs"></i> Ends in {formatDateRemaining(proposal.endDate)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        {proposal.description}
                      </div>
                      <div className="mt-3">
                        <div className="relative pt-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Current votes: {totalVotes}</span>
                            <div className="text-xs text-slate-600 dark:text-slate-400">
                              <span className="text-green-600 dark:text-green-400">For: {forPercentage}%</span>
                              <span className="mx-2 text-slate-400">|</span>
                              <span className="text-red-600 dark:text-red-400">Against: {againstPercentage}%</span>
                            </div>
                          </div>
                          <div className="flex h-2 overflow-hidden text-xs rounded bg-slate-200 dark:bg-slate-700">
                            <div 
                              style={{ width: `${forPercentage}%` }} 
                              className="bg-green-500 dark:bg-green-600"
                            ></div>
                            <div 
                              style={{ width: `${againstPercentage}%` }} 
                              className="bg-red-500 dark:bg-red-600"
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-3">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full text-white bg-green-600 hover:bg-green-700"
                          onClick={() => handleVote(proposal.id, true)}
                        >
                          <i className="fas fa-check mr-1"></i> Vote For
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full text-white bg-red-600 hover:bg-red-700"
                          onClick={() => handleVote(proposal.id, false)}
                        >
                          <i className="fas fa-times mr-1"></i> Vote Against
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="inline-flex items-center px-3 py-1.5 border border-slate-300 dark:border-slate-600 text-xs font-medium rounded-full text-slate-700 dark:text-slate-300 bg-white dark:bg-gray-900 hover:bg-slate-50 dark:hover:bg-gray-800"
                          onClick={() => showProposalDetails(proposal)}
                        >
                          <i className="fas fa-info-circle mr-1"></i> View Details
                        </Button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="px-6 py-4 flex justify-between border-t border-slate-200 dark:border-slate-700">
              <Button 
                variant="link" 
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 p-0 h-auto font-normal"
              >
                View Past Proposals
              </Button>
              <Button 
                variant="link" 
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 p-0 h-auto font-normal"
              >
                <i className="fas fa-plus mr-1"></i> Create Proposal
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Proposal Details Dialog */}
      {selectedProposal && (
        <ProposalDetailsDialog
          isOpen={!!selectedProposal}
          onClose={() => setSelectedProposal(null)}
          title={selectedProposal.title}
          description={selectedProposal.description}
        />
      )}
    </div>
  );
}
