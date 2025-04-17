import { useWeb3 } from "@/hooks/useWeb3";
import { useNftDetails } from "@/hooks/useNftDetails";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { truncateAddress } from "@/lib/utils";

export default function NFTSoulID() {
  const { address, isConnected } = useWeb3();
  const { nft, isLoading } = useNftDetails();
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [transferDetails, setTransferDetails] = useState({
    toWalletAddress: "",
    reason: "",
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const transferRequest = useMutation({
    mutationFn: async (data: {
      nftId: number;
      fromUserId: number;
      toWalletAddress: string;
      reason: string;
    }) => {
      return apiRequest("POST", "/api/transfer-requests", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users/1/nft'] });
      setIsTransferOpen(false);
      setTransferDetails({ toWalletAddress: "", reason: "" });
      
      toast({
        title: "Transfer request submitted",
        description: "Your NFT transfer request has been submitted for approval. You'll be notified once it's processed.",
      });
    },
    onError: () => {
      toast({
        title: "Transfer request failed",
        description: "There was an error submitting your transfer request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleTransferSubmit = () => {
    if (!nft) return;
    
    transferRequest.mutate({
      nftId: nft.id,
      fromUserId: 1, // In a real app, this would be the current user's ID
      toWalletAddress: transferDetails.toWalletAddress,
      reason: transferDetails.reason,
    });
  };

  return (
    <>
      <div className="pb-5 border-b border-slate-200 dark:border-slate-700 mb-8">
        <h1 className="text-2xl font-bold leading-6 text-slate-900 dark:text-white">
          NFT Soul ID
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Your unique non-transferable identity NFT for the FirstStepAI ecosystem
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {isLoading ? (
            <Skeleton className="aspect-square w-full rounded-lg" />
          ) : !nft ? (
            <Card>
              <CardHeader>
                <CardTitle>No Soul ID NFT Found</CardTitle>
                <CardDescription>
                  You don't have a Soul ID NFT yet. Mint one to get started.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                  <i className="fas fa-id-badge text-4xl text-slate-400 dark:text-slate-600"></i>
                </div>
                <p className="text-center text-slate-600 dark:text-slate-400 mb-6 max-w-xs">
                  Your Soul ID is your digital identity in the FirstStepAI ecosystem. It's unique, non-transferable, and represents your reputation.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button disabled={!isConnected}>
                  <i className="fas fa-plus-circle mr-2"></i> Mint Soul ID
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="relative aspect-square bg-gradient-to-br from-primary-700 to-blue-600 rounded-lg shadow-lg overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-repeat" style={{ 
                  backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4yIiBjeD0iMTAiIGN5PSIxMCIgcj0iMy41Ii8+PC9nPjwvc3ZnPg==')" 
                }}></div>
              </div>
              <div className="absolute inset-0 flex flex-col justify-between p-8 text-white">
                <div>
                  <div className="text-sm font-mono opacity-80">#{nft.tokenId}</div>
                  <div className="mt-4 text-3xl font-semibold font-mono tracking-wider">SOUL ID</div>
                  <div className="mt-2 text-sm opacity-80">FirstStepAI Identity Token</div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="text-sm opacity-80">Issued</div>
                    <div className="text-sm">{new Date(nft.mintedAt).toLocaleDateString()}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm opacity-80">Owner</div>
                    <div className="text-sm font-mono">{truncateAddress(address || "")}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm opacity-80">Network</div>
                    <div className="text-sm">{nft.network}</div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-white/20">
                    <div className="text-xs opacity-60 mb-1">SOUL ID NFT is non-transferable by default</div>
                    <div className="flex text-xs opacity-60">Transfers require approval from FirstStepAI governance</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>NFT Details</CardTitle>
              <CardDescription>
                Information about your non-transferable Identity NFT
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-48" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-64" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                </>
              ) : !nft ? (
                <div className="text-center py-6">
                  <p className="text-slate-500 dark:text-slate-400">
                    Mint a Soul ID NFT to see its details here
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Token ID</h3>
                    <p className="mt-1 text-lg font-mono text-slate-900 dark:text-white">#{nft.tokenId}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Contract Address</h3>
                    <p className="mt-1 text-lg font-mono text-slate-900 dark:text-white truncate">
                      {nft.metadata.contractAddress || "0x7c3aed5f1d8f15ee34e4c4a066dd85dd24071a12"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Status</h3>
                    <p className="mt-1 flex items-center">
                      <span className={`inline-block w-3 h-3 rounded-full mr-2 ${nft.isActive ? "bg-green-500" : "bg-red-500"}`}></span>
                      <span className="text-lg text-slate-900 dark:text-white">{nft.isActive ? "Active" : "Inactive"}</span>
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Blockchain</h3>
                    <p className="mt-1 text-lg text-slate-900 dark:text-white">{nft.network}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Mint Date</h3>
                    <p className="mt-1 text-lg text-slate-900 dark:text-white">{new Date(nft.mintedAt).toLocaleString()}</p>
                  </div>
                </>
              )}
            </CardContent>
            {nft && (
              <CardFooter className="flex justify-between">
                <Button variant="outline">
                  <i className="fas fa-external-link-alt mr-2"></i> View on Explorer
                </Button>
                <Button onClick={() => setIsTransferOpen(true)}>
                  <i className="fas fa-exchange-alt mr-2"></i> Request Transfer
                </Button>
              </CardFooter>
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About Soul ID NFTs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <p>
                <strong>Non-Transferable by Default:</strong> Your Soul ID is tied to your identity in the FirstStepAI ecosystem and cannot be freely traded or transferred.
              </p>
              <p>
                <strong>Approval-Based Transfers:</strong> If you need to transfer your Soul ID to a new wallet, you must submit a request that will be reviewed by the system administrators.
              </p>
              <p>
                <strong>Reputation & Trust:</strong> Your Soul ID is linked to your trust score and community reputation. It displays your achievements and contributions to the ecosystem.
              </p>
              <p>
                <strong>Governance Rights:</strong> Having an active Soul ID grants you voting rights in the FirstStepAI DAO, proportional to your trust level.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Transfer Request Dialog */}
      <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request NFT Transfer</DialogTitle>
            <DialogDescription>
              Soul ID transfers require approval. Please provide the destination wallet address and reason for transfer.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="toWalletAddress">Destination Wallet Address</Label>
              <Input
                id="toWalletAddress"
                placeholder="0x..."
                value={transferDetails.toWalletAddress}
                onChange={(e) => setTransferDetails({ ...transferDetails, toWalletAddress: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reason">Reason for Transfer</Label>
              <Textarea
                id="reason"
                placeholder="Explain why you need to transfer your Soul ID..."
                value={transferDetails.reason}
                onChange={(e) => setTransferDetails({ ...transferDetails, reason: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsTransferOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handleTransferSubmit}
              disabled={!transferDetails.toWalletAddress || !transferDetails.reason || transferRequest.isPending}
            >
              {transferRequest.isPending ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i> Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
