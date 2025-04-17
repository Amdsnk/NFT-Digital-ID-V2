import { useState } from "react";
import { VotingProposals } from "@/components/dao/VotingProposals";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useWeb3 } from "@/hooks/useWeb3";
import { WalletConnect } from "@/components/web3/WalletConnect";

const proposalSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  endDate: z.date().refine((date) => date > new Date(), {
    message: "End date must be in the future",
  }),
});

type ProposalFormValues = z.infer<typeof proposalSchema>;

export default function DAOVoting() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { address, isConnected, connect } = useWeb3();

  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      title: "",
      description: "",
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 7 days from now
    },
  });

  const proposalMutation = useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      creatorId: number;
      startDate: Date;
      endDate: Date;
      isActive: boolean;
    }) => {
      return apiRequest("POST", "/api/proposals", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/proposals'] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Proposal submitted",
        description: "Your proposal has been created successfully and is now open for voting.",
      });
    },
    onError: () => {
      toast({
        title: "Submission failed",
        description: "There was an error submitting your proposal. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: ProposalFormValues) => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a proposal",
        variant: "destructive",
      });
      return;
    }

    proposalMutation.mutate({
      title: values.title,
      description: values.description,
      creatorId: 1, // In a real app, this would be the current user's ID
      startDate: new Date(),
      endDate: values.endDate,
      isActive: true,
    });
  };

  return (
    <>
      <div className="pb-5 border-b border-slate-200 dark:border-slate-700 sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold leading-6 text-slate-900 dark:text-white sm:truncate">
            DAO Voting
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Participate in governance decisions for the FirstStepAI ecosystem
          </p>
        </div>
        <div className="mt-3 flex sm:mt-0 sm:ml-4">
          <Button onClick={() => setIsDialogOpen(true)} disabled={!isConnected}>
            <i className="fas fa-plus mr-2"></i>
            Create Proposal
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <VotingProposals />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Voting Power</CardTitle>
              <CardDescription>
                Your influence in the FirstStepAI DAO
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isConnected ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                    <i className="fas fa-wallet text-slate-400 dark:text-slate-500"></i>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Connect your wallet to see your voting power
                  </p>
                  {/* Fixed: Using WalletConnect component instead of a non-functional button */}
                  <WalletConnect />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Base Voting Power</span>
                    <span className="font-medium">1.0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Trust Level Bonus</span>
                    <span className="font-medium text-green-600 dark:text-green-400">+0.5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Badge Bonus</span>
                    <span className="font-medium text-green-600 dark:text-green-400">+0.2</span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Voting Power</span>
                      <span className="font-bold text-xl">1.7</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Voting Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <p>
                <strong>Eligibility:</strong> Any user with an active Soul ID NFT can participate in governance voting.
              </p>
              <p>
                <strong>Voting Power:</strong> Your voting power is determined by your trust level, badges, and overall contribution to the ecosystem.
              </p>
              <p>
                <strong>Proposal Creation:</strong> To create a proposal, you must have a trust level of at least 2 and have been active for at least 30 days.
              </p>
              <p>
                <strong>Voting Period:</strong> Most proposals have a voting period of 5-7 days, after which the results are finalized and executed if approved.
              </p>
              <p>
                <strong>Quorum Requirements:</strong> A minimum of 10% of eligible voters must participate for a proposal to be valid.
              </p>
              <p>
                <strong>Majority Rules:</strong> Proposals require a simple majority (more than 50%) to pass, except for critical changes which require a 2/3 majority.
              </p>
              <p>
                <strong>Execution Delay:</strong> Approved proposals have a 48-hour delay before execution to allow for security reviews.
              </p>
              <p>
                <strong>Voting Privacy:</strong> All votes are recorded on-chain and are publicly visible for transparency.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="link" className="p-0 h-auto">
                Read Full Governance Documentation
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Create Proposal Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Proposal</DialogTitle>
            <DialogDescription>
              Submit a new governance proposal for the community to vote on. Be clear and specific about what you're proposing.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proposal Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Clear, concise title for your proposal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detailed description of your proposal..."
                        className="resize-none"
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Voting End Date</FormLabel>
                    <DatePicker
                      date={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={proposalMutation.isPending}>
                  {proposalMutation.isPending ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i> Submitting...
                    </>
                  ) : (
                    "Create Proposal"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
